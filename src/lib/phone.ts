const digitsOnly = (value: string) => value.replace(/[^0-9]/g, "");

export const formatPhoneDisplay = (value?: string | null) => {
  if (!value) return "";
  const digits = digitsOnly(value);
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value;
};

export const formatPhoneHref = (value?: string | null) => {
  if (!value) return "";
  const digits = digitsOnly(value);
  return digits ? `tel:${digits}` : "";
};
