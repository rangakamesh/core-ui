import {
  forwardRef,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { cx } from "../utils/cx.ts";

export function Label({
  required,
  className,
  children,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label className={cx("rk-label", className)} {...rest}>
      {children}
      {required && (
        <span className="rk-label__required" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

interface ControlProps {
  /** Marks the control invalid (red border + aria-invalid). */
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & ControlProps>(
  function Input({ invalid, className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || rest["aria-invalid"] || undefined}
        className={cx("rk-input", className)}
        {...rest}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & ControlProps>(
  function Textarea({ invalid, className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || rest["aria-invalid"] || undefined}
        className={cx("rk-textarea", className)}
        {...rest}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & ControlProps>(
  function Select({ invalid, className, ...rest }, ref) {
    return (
      <select
        ref={ref}
        aria-invalid={invalid || rest["aria-invalid"] || undefined}
        className={cx("rk-select", className)}
        {...rest}
      />
    );
  },
);

export const Checkbox = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: ReactNode; type?: "checkbox" | "radio" }
>(function Checkbox({ label, className, type = "checkbox", ...rest }, ref) {
  return (
    <label className={cx("rk-check", className)}>
      <input ref={ref} type={type} {...rest} />
      <span>{label}</span>
    </label>
  );
});

export function Hint({ error, className, ...rest }: HTMLAttributes<HTMLParagraphElement> & { error?: boolean }) {
  return <p className={cx("rk-hint", error && "rk-hint--error", className)} role={error ? "alert" : undefined} {...rest} />;
}

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  /** id of the control inside; links the label to it. */
  htmlFor?: string;
  required?: boolean;
  hint?: ReactNode;
  /** Error message; replaces the hint when set. */
  error?: ReactNode;
}

/**
 * Label + control + hint/error, stacked.
 *   <Field label="Email" htmlFor="email" error={errors.email}>
 *     <Input id="email" type="email" invalid={!!errors.email} />
 *   </Field>
 */
export function Field({ label, htmlFor, required, hint, error, className, children, ...rest }: FieldProps) {
  return (
    <div className={cx("rk-field", className)} {...rest}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error ? <Hint error>{error}</Hint> : hint ? <Hint>{hint}</Hint> : null}
    </div>
  );
}
