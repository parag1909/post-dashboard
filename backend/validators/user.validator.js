import validator from "validator";

export const validateRegistration = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = [];

  if (!username || username.trim().length < 3 || username.trim().length > 20) {
    errors.push("Username must be between 3 and 20 characters");
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }

  if (!validator.isEmail(email)) {
    errors.push("Invalid email format");
  }

  const passwordValidationOptions = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  };

  // if (!validator.isStrongPassword(password, passwordValidationOptions)) {
  //   errors.push(
  //     "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
  //   );
  // }

  // Password confirmation
  if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  return errors;
};

export const validateLogin = (username, password) => {
  const errors = [];

  if (!username) {
    errors.push("Username is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  return errors;
};
