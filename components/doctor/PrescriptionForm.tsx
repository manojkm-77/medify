import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Prescription, RxItem, Dosage, AIRecommendation } from '../../types/prescription';
import { generatePrescriptionSuggestion } from '../../services/geminiService';
import medicinesData from '../../data/medicines.json';
import useVoiceRecognition from '../../hooks/useVoiceRecognition';
import useDebounce from '../../hooks/useDebounce';
import { useLanguage } from '../../i18n/LanguageContext';

import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select, SelectItem } from '../ui/Select';
import { Command, CommandInput, CommandItem, CommandList } from '../ui/Command';
import { Badge } from '../ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog';
import { ICONS } from '../../constants';

interface PrescriptionFormProps {
  onSubmit: (prescription: Prescription) => void;
  initial?: Partial<Prescription>;
  onChange?: (prescription: Prescription) => void;
}

const defaultDosage: Dosage = {
  strength: '',
  route: 'oral',
  frequency: 'once daily',
  durationDays: 7,
  instructions: '',
};

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  onSubmit,
  initial,
  onChange,
}) => {
  const { t, locale } = useLanguage();
  const [prescription, setPrescription] = useState<Prescription>({
    items: initial?.items || [],
    diagnosis: initial?.diagnosis || '',
    notes: initial?.notes || '',
  });
  const [symptoms, setSymptoms] = useState('');
  const [aiResults, setAiResults] = useState<AIRecommendation | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const [medQuery, setMedQuery] = useState('');
  const debouncedMedQuery = useDebounce(medQuery, 200);
  const [filteredMeds, setFilteredMeds] = useState<{ name: string; strengths: string[] }[]>([]);
  const [isMedListOpen, setIsMedListOpen] = useState(false);

  const [currentItem, setCurrentItem] = useState<Omit<RxItem, 'id'>>({ medicine: '', dosage: defaultDosage });
  const [validationError, setValidationError] = useState('');

  const [editingItem, setEditingItem] = useState<RxItem | null>(null);
  
  const langCode = locale === 'hi' ? 'hi-IN' : 'en-IN';
  const { text: voiceText, isListening, startListening, stopListening, hasRecognitionSupport } = useVoiceRecognition(langCode);

  useEffect(() => {
    if (voiceText) {
      setSymptoms(voiceText);
    }
  }, [voiceText]);
  
  useEffect(() => {
    onChange?.(prescription);
  }, [prescription, onChange]);

  useEffect(() => {
    if (debouncedMedQuery) {
      const lowerQuery = debouncedMedQuery.toLowerCase();
      setFilteredMeds(
        medicinesData.filter(med => med.name.toLowerCase().includes(lowerQuery)).slice(0, 5)
      );
      setIsMedListOpen(true);
    } else {
      setFilteredMeds([]);
      setIsMedListOpen(false);
    }
  }, [debouncedMedQuery]);


  const handleAiRecommend = async () => {
    if (!symptoms.trim()) return;
    setIsAiLoading(true);
    setAiError('');
    setAiResults(null);
    try {
      const result = await generatePrescriptionSuggestion(symptoms);
      if (result) {
        setAiResults(result);
        setPrescription(prev => ({...prev, diagnosis: result.diagnosis }));
      } else {
        throw new Error("AI failed to provide suggestion.");
      }
    } catch (error) {
      console.error(error);
      setAiError(t('prescriptionForm.aiError'));
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSelectMedicine = (medName: string) => {
    const med = medicinesData.find(m => m.name === medName);
    if (!med) return;
    
    setMedQuery(med.name);
    setCurrentItem(prev => ({
        ...prev,
        medicine: med.name,
        dosage: { ...prev.dosage, strength: med.strengths[0] || '' }
    }));
    setIsMedListOpen(false);
  };
  
  const handleAddItem = () => {
    if (!currentItem.medicine || !currentItem.dosage.frequency || !currentItem.dosage.strength || currentItem.dosage.durationDays < 1) {
        setValidationError(t('prescriptionForm.validationError'));
        return;
    }
    setValidationError('');
    
    const newItem: RxItem = { id: uuidv4(), ...currentItem };

    setPrescription(prev => ({ ...prev, items: [...prev.items, newItem] }));
    
    setCurrentItem({ medicine: '', dosage: defaultDosage });
    setMedQuery('');
  };
  
  const handleAddAiItem = (item: AIRecommendation['items'][0]) => {
     const newItem: RxItem = {
         id: uuidv4(),
         medicine: item.medicine,
         dosage: { ...defaultDosage, ...item.dosage }
     };
     setPrescription(prev => ({...prev, items: [...prev.items, newItem]}));
  };
  
  const handleDeleteItem = (id: string) => {
    setPrescription(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };
  
  const handleUpdateItem = () => {
    if (!editingItem) return;
    setPrescription(prev => ({ ...prev, items: prev.items.map(item => item.id === editingItem.id ? editingItem : item) }));
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{t('prescriptionForm.symptomsTitle')}</h3>
            <div className="relative">
                <Textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={4}
                    placeholder={t('prescriptionForm.symptomsPlaceholder')}
                />
                 {hasRecognitionSupport && (
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                      aria-label={isListening ? t('budgetPlanner.voiceListenStop') : t('budgetPlanner.voiceListenStart')}
                    >
                      <ICONS.MicIcon className="w-5 h-5" />
                    </button>
                  )}
            </div>
            <Button onClick={handleAiRecommend} disabled={isAiLoading} className="mt-4">
                {isAiLoading ? t('prescriptionForm.aiLoading') : t('prescriptionForm.aiRecommend')}
            </Button>
        </div>
        {(isAiLoading || aiError || aiResults) && (
            <div className="p-6 border-t bg-slate-50">
                 <h4 className="font-semibold text-slate-700 mb-2">{t('prescriptionForm.aiSuggestions')}</h4>
                {isAiLoading && <p>{t('prescriptionForm.aiLoading')}...</p>}
                {aiError && <p className="text-red-500">{aiError}</p>}
                {aiResults && (
                    <div className="space-y-4">
                        {aiResults.warnings.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {aiResults.warnings.map((w, i) => <Badge key={i} variant="destructive">{w}</Badge>)}
                            </div>
                        )}
                         <p className="text-sm"><strong>{t('prescriptionForm.aiDiagnosis')}:</strong> {aiResults.diagnosis}</p>
                         <div className="space-y-2">
                            {aiResults.items.map((item, i) => (
                                <Card key={i} className="p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold">{item.medicine} <span className="font-normal text-slate-600">{item.dosage.strength}</span></p>
                                            <p className="text-xs text-slate-500 italic">{item.reason}</p>
                                        </div>
                                        <Button size="sm" variant="secondary" onClick={() => handleAddAiItem(item)}>{t('prescriptionForm.add')}</Button>
                                    </div>
                                </Card>
                            ))}
                         </div>
                    </div>
                )}
            </div>
        )}
      </Card>
      
      <Card className="p-6">
         <h3 className="text-lg font-bold text-slate-800 mb-4">{t('prescriptionForm.addMedicineTitle')}</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="relative col-span-1 md:col-span-3 lg:col-span-1">
                 <label className="text-sm font-medium">{t('prescriptionForm.medicineName')}</label>
                 <Command>
                    <CommandInput 
                        placeholder={t('prescriptionForm.medicinePlaceholder')} 
                        value={medQuery}
                        onValueChange={setMedQuery}
                        onFocus={() => setIsMedListOpen(true)}
                        onBlur={() => setTimeout(() => setIsMedListOpen(false), 150)}
                    />
                    {isMedListOpen && filteredMeds.length > 0 && (
                        <CommandList className="absolute top-full mt-1 w-full bg-white border rounded-md shadow-lg z-10">
                            {filteredMeds.map(med => (
                                <CommandItem key={med.name} onSelect={handleSelectMedicine}>
                                    {med.name}
                                </CommandItem>
                            ))}
                        </CommandList>
                    )}
                </Command>
            </div>
            <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-3 lg:col-span-2">
                <div>
                     <label className="text-sm font-medium">{t('prescriptionForm.strength')}</label>
                     <Input value={currentItem.dosage.strength} onChange={e => setCurrentItem(p => ({...p, dosage: {...p.dosage, strength: e.target.value}}))} />
                </div>
                <div>
                     <label className="text-sm font-medium">{t('prescriptionForm.route')}</label>
                     <Select value={currentItem.dosage.route} onValueChange={(e) => setCurrentItem(p => ({...p, dosage: {...p.dosage, route: e.target.value as any}}))}>
                        <SelectItem value="oral">Oral</SelectItem>
                        <SelectItem value="topical">Topical</SelectItem>
                        <SelectItem value="inhalation">Inhalation</SelectItem>
                        <SelectItem value="injection">Injection</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                     </Select>
                </div>
                <div>
                     <label className="text-sm font-medium">{t('prescriptionForm.frequency')}</label>
                     <Input value={currentItem.dosage.frequency} onChange={e => setCurrentItem(p => ({...p, dosage: {...p.dosage, frequency: e.target.value}}))} />
                </div>
                <div>
                     <label className="text-sm font-medium">{t('prescriptionForm.duration')}</label>
                     <Input type="number" value={currentItem.dosage.durationDays} onChange={e => setCurrentItem(p => ({...p, dosage: {...p.dosage, durationDays: parseInt(e.target.value, 10) || 0}}))} />
                </div>
                <div className="col-span-2">
                    <label className="text-sm font-medium">{t('prescriptionForm.instructions')}</label>
                    <Input placeholder="e.g. after food" value={currentItem.dosage.instructions || ''} onChange={e => setCurrentItem(p => ({...p, dosage: {...p.dosage, instructions: e.target.value}}))} />
                </div>
            </div>
         </div>
         <div className="mt-4 flex justify-end">
            <Button onClick={handleAddItem}>{t('prescriptionForm.addToPrescription')}</Button>
         </div>
         {validationError && <p className="text-red-500 text-sm mt-2 text-right">{validationError}</p>}
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">{t('prescriptionForm.currentPrescription')}</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                        <th className="px-4 py-2">{t('prescriptionForm.medicine')}</th>
                        <th className="px-4 py-2">{t('prescriptionForm.dosage')}</th>
                        <th className="px-4 py-2">{t('prescriptionForm.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {prescription.items.length === 0 && (
                        <tr><td colSpan={3} className="text-center p-4 text-slate-500">{t('prescriptionForm.noMedsAdded')}</td></tr>
                    )}
                    {prescription.items.map(item => (
                        <tr key={item.id} className="border-b">
                            <td className="px-4 py-2 font-medium">{item.medicine}</td>
                            <td className="px-4 py-2">
                                {item.dosage.strength}, {item.dosage.route}, {item.dosage.frequency} for {item.dosage.durationDays} days.
                                {item.dosage.instructions && <span className="block text-xs text-slate-500">({item.dosage.instructions})</span>}
                            </td>
                            <td className="px-4 py-2 space-x-2">
                                <button onClick={() => setEditingItem(item)} className="p-1 text-slate-500 hover:text-primary-blue"><ICONS.EditIcon className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-slate-500 hover:text-accent-red"><ICONS.Trash2Icon className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={() => onSubmit(prescription)}>{t('prescriptionForm.finalizeButton')}</Button>
      </div>

       <Dialog open={!!editingItem} onOpenChange={(isOpen) => !isOpen && setEditingItem(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t('prescriptionForm.editMedication')}: {editingItem?.medicine}</DialogTitle>
            </DialogHeader>
            {editingItem && (
                 <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                         <label className="text-sm font-medium">{t('prescriptionForm.strength')}</label>
                         <Input value={editingItem.dosage.strength} onChange={e => setEditingItem(p => p && ({...p, dosage: {...p.dosage, strength: e.target.value}}))} />
                    </div>
                    <div>
                         <label className="text-sm font-medium">{t('prescriptionForm.route')}</label>
                         <Select value={editingItem.dosage.route} onValueChange={(e) => setEditingItem(p => p && ({...p, dosage: {...p.dosage, route: e.target.value as any}}))}>
                             <SelectItem value="oral">Oral</SelectItem>
                             <SelectItem value="topical">Topical</SelectItem>
                             <SelectItem value="inhalation">Inhalation</SelectItem>
                            <SelectItem value="injection">Injection</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                         </Select>
                    </div>
                    <div>
                         <label className="text-sm font-medium">{t('prescriptionForm.frequency')}</label>
                         <Input value={editingItem.dosage.frequency} onChange={e => setEditingItem(p => p && ({...p, dosage: {...p.dosage, frequency: e.target.value}}))} />
                    </div>
                    <div>
                         <label className="text-sm font-medium">{t('prescriptionForm.duration')}</label>
                         <Input type="number" value={editingItem.dosage.durationDays} onChange={e => setEditingItem(p => p && ({...p, dosage: {...p.dosage, durationDays: parseInt(e.target.value, 10) || 0}}))} />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">{t('prescriptionForm.instructions')}</label>
                        <Input value={editingItem.dosage.instructions || ''} onChange={e => setEditingItem(p => p && ({...p, dosage: {...p.dosage, instructions: e.target.value}}))} />
                    </div>
                </div>
            )}
            <DialogFooter>
                <Button variant="secondary" onClick={() => setEditingItem(null)}>{t('prescriptionForm.cancel')}</Button>
                <Button onClick={handleUpdateItem}>{t('prescriptionForm.saveChanges')}</Button>
            </DialogFooter>
        </DialogContent>
       </Dialog>
    </div>
  );
};
