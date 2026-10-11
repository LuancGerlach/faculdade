import bcrypt from 'bcryptjs';

// Equivalente ao PasswordEncoder (BCrypt) do Spring Security
const BCRYPT_ROUNDS = 10;

export const PasswordEncoderUtils = {
  encode: (rawPassword: string) => bcrypt.hash(rawPassword, BCRYPT_ROUNDS),
  matches: (rawPassword: string, passwordHash: string) => bcrypt.compare(rawPassword, passwordHash),
};
