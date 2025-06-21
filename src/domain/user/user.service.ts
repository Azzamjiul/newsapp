import { User, IUser } from './user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

export class UserService {
  async register(name: string, email: string, password: string) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword } as IUser);
    return { id: user.id, name: user.name, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials.');
    }
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1d' });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async getById(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found.');
    }
    return { id: user.id, name: user.name, email: user.email };
  }

  async update(id: number, updates: { name?: string; email?: string; password?: string; notificationsEnabled?: boolean }) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found.');
    }
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    await user.update(updates);
    return { id: user.id, name: user.name, email: user.email, notificationsEnabled: user.notificationsEnabled };
  }

  async remove(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found.');
    }
    await user.destroy();
    return { message: 'User deleted.' };
  }
}
