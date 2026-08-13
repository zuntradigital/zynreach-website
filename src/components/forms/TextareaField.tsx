import { useId } from "react";
import { AlertCircle } from "lucide-react";

interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

export function TextareaField({
  label,
  name,
  value,
  onChange,
  error,
  required,
  placeholder,
  rows = 4,
}: TextareaFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-900">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-error">
            {" *"}
          </span>
        ) : null}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1.5 w-full rounded-md border bg-white px-3 py-2 text-sm text-neutral-900 focus-visible:outline-none dark:bg-neutral-100 ${
          error ? "border-error" : "border-neutral-300 focus-visible:border-primary-500"
        }`}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-error">
          <AlertCircle aria-hidden="true" className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
