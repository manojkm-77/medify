# PrescriptionForm Component

A self-contained, reusable smart e-prescription interface for doctors.

## Usage

Import the component and use it within your application. It manages its own state and provides the final prescription object via an `onSubmit` callback.

```tsx
import { PrescriptionForm } from '@/components/PrescriptionForm';
import type { Prescription } from '@/types/prescription';

const MyPrescriptionPage = () => {
  const handlePrescriptionSubmit = (prescription: Prescription) => {
    console.log('Final Prescription:', prescription);
    // POST this object to your backend API
    // fetch('/api/prescriptions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(prescription),
    // });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Create New Prescription</h1>
      <PrescriptionForm onSubmit={handlePrescriptionSubmit} />
    </div>
  );
};
```

## Props

| Prop          | Type                            | Description                                                                                             |
|---------------|---------------------------------|---------------------------------------------------------------------------------------------------------|
| `onSubmit`    | `(p: Prescription) => void`     | **Required.** Callback function that receives the final, typed prescription object when submitted.      |
| `initial`     | `Partial<Prescription>`         | Optional. An initial prescription object to pre-populate the form for editing.                          |
| `onChange`    | `(p: Prescription) => void`     | Optional. Callback that fires every time the prescription state changes (e.g., adding/deleting an item).|
| `aiEndpoint`  | `string`                        | Optional. If provided, the component will POST to this URL for AI recommendations instead of using the mock. |
