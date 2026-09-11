export const validateRegisterData = (
  name: unknown,
  email: unknown,
  password: unknown
): string | null => {
  if (
    typeof name !== "string" ||
    !name.trim()
  ) {
    return "Name is required";
  }

  if (
    typeof email !== "string" ||
    !email.trim()
  ) {
    return "Email is required";
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Invalid email address";
  }

  if (
    typeof password !== "string" ||
    password.length < 6
  ) {
    return "Password must be at least 6 characters";
  }

  return null;
};