"use client";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const formatMiles = (digits: string) =>
  digits ? new Intl.NumberFormat("es-CL").format(Number(digits)) : "";

export default function CurrencyInput({ value, onChange, className, placeholder }: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.replace(/\D/g, ""));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={value ? `$${formatMiles(value)}` : ""}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
    />
  );
}
