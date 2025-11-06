import * as React from 'react';
import { cn } from '../../lib/utils';

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      className={cn(
        'block w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-colors disabled:bg-slate-100',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';

// These are just for API compatibility with shadcn code examples
const SelectValue = () => null;
// FIX: Made children optional to fix "Property 'children' is missing" error.
const SelectTrigger = ({ children }: {children?: React.ReactNode}) => <>{children}</>;
// FIX: Made children optional to fix "Property 'children' is missing" error.
const SelectContent = ({ children }: {children?: React.ReactNode}) => <>{children}</>;
const SelectItem = React.forwardRef<HTMLOptionElement, React.OptionHTMLAttributes<HTMLOptionElement>>(({ children, ...props }, ref) => (
  <option ref={ref} {...props}>
    {children}
  </option>
));
SelectItem.displayName = 'SelectItem';

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem };
