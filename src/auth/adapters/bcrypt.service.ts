import bcrypt from 'bcrypt';

export const bcryptService = {
  async verifyPasswords(
    dtoPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(dtoPassword, userPassword);
  },
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },
};
