import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-ui font-medium text-text">{label}</span>
      <input
        className={`w-full rounded-xl border border-border bg-white px-4 py-3 font-body text-sm text-text shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${className ?? ""}`}
        {...props}
      />
    </label>
  );
}
