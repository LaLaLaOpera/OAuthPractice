import { promisify } from 'util';
import { randomBytes, scrypt as _scrpyt } from 'crypto';

const scrypt = promisify(_scrpyt);

export const passwordEncryption = {
  encryption: async (password) => {
    const salt = randomBytes(8).toString('hex'); // => 16 characters long

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hased result and the salt together
    const result = salt + '.' + hash.toString('hex');

    return result;
  },
  validation: async (password, client) => {
    const [salt, storedhash] = client.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedhash !== hash.toString('hex')) {
      return false;
    }
    return true;
  },
};
