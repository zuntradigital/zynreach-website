import { useId } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
  placeholder,
}: SelectFieldProps) {
  const t = useTranslations("common.form");
  const id = useId();
  const errorId = `${id}-error`;
  const resolvedPlaceholder = placeholder ?? t("select");

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
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1.5 min-h-11 w-full rounded-md border bg-white dark:bg-neutral-100 px-3 text-sm text-neutral-900 focus-visible:outline-none ${
          error ? "border-error" : "border-neutral-300 focus-visible:border-primary-500"
        }`}
      >
        <option value="" disabled>
          {resolvedPlaceholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-error">
          <AlertCircle aria-hidden="true" className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
