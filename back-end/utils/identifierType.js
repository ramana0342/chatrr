export const getIdentifierType = (identifier) => {
  const value = identifier.trim();

  if (value.includes("@")) return "email";

  if (/^[0-9]{10}$/.test(value)) return "mobile";

  return "user_name";
};