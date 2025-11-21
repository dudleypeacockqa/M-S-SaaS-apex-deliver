// Enhanced form field component with consistent error handling
import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface BaseFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  description?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

interface TextareaFieldProps extends BaseFieldProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const FormField: React.FC<InputFieldProps> = ({
  label,
  error,
  required,
  className,
  description,
  type = 'text',
  ...inputProps
}) => {
  const fieldId = React.useId();
  
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          id={fieldId}
          type={type}
          className={cn(
            'transition-colors',
            error && 'border-destructive focus:ring-destructive'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : description ? `${fieldId}-description` : undefined}
          {...inputProps}
        />
        
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
        )}
      </div>
      
      {description && !error && (
        <p id={`${fieldId}-description`} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export const FormTextarea: React.FC<TextareaFieldProps> = ({
  label,
  error,
  required,
  className,
  description,
  rows = 4,
  ...textareaProps
}) => {
  const fieldId = React.useId();
  
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Textarea
          id={fieldId}
          rows={rows}
          className={cn(
            'transition-colors resize-none',
            error && 'border-destructive focus:ring-destructive'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : description ? `${fieldId}-description` : undefined}
          {...textareaProps}
        />
        
        {error && (
          <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-destructive" />
        )}
      </div>
      
      {description && !error && (
        <p id={`${fieldId}-description`} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export const FormSelect: React.FC<SelectFieldProps> = ({
  label,
  error,
  required,
  className,
  description,
  options,
  placeholder,
  ...selectProps
}) => {
  const fieldId = React.useId();
  
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <select
          id={fieldId}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors',
            error && 'border-destructive focus:ring-destructive'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : description ? `${fieldId}-description` : undefined}
          {...selectProps}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
        )}
      </div>
      
      {description && !error && (
        <p id={`${fieldId}-description`} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
};