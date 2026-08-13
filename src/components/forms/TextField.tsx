import { useId } from "react";
import { AlertCircle } from "lucide-react";

interface TextFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "password";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}

/** SRS 10 Forms: label-above-field, inline validation, 44px min touch target. */
export function TextField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
  autoComplete,
  placeholder,
}: TextFieldProps) {
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
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1.5 min-h-11 w-full rounded-md border bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none dark:bg-neutral-100 ${
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
