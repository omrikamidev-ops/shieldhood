const encoder = new TextEncoder();

export const hashPassword = async (value: string) => {
  const data = encoder.encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const isValidAdminCookie = (cookieValue: string, expectedHash: string) =>
  cookieValue.length > 0 && cookieValue === expectedHash;
