import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import envConfig from '@/config/env';

const { JWT_SECRET } = envConfig;
export const hashPassword=async(password: string)=> {
const salt=await bcrypt.genSalt(10);
return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashed: string) => {
  return bcrypt.compare(password, hashed);
};

export const generateJWT = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
};