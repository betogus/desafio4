import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import path from 'path';

export  const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValid = (user, password) => bcrypt.compareSync(password, user.password)
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const publicPath = path.join(__dirname, '../public');

