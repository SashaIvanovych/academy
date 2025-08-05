import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const createUserRepository = (dataSource: DataSource) => {
  return dataSource.getRepository(User).extend({
    async findByEmail(email: string): Promise<User | undefined> {
      return this.findOne({ where: { email } });
    },

    async register(email: string, password: string): Promise<User> {
      const existing = await this.findByEmail(email);
      if (existing) {
        throw new ConflictException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.create({
        email,
        password: hashedPassword,
        refreshToken: null,
      });
      return this.save(user);
    },

    async validateUser(email: string, password: string): Promise<User | null> {
      const user = await this.findByEmail(email);
      if (!user) {
        return null;
      }

      const isPasswordValid = await user.validatePassword(password);
      return isPasswordValid ? user : null;
    },

    async saveRefreshToken(
      userId: string,
      refreshToken: string,
    ): Promise<void> {
      await this.update(userId, { refreshToken });
    },

    async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
      return this.findOne({ where: { refreshToken } });
    },

    async clearRefreshToken(userId: string): Promise<void> {
      await this.update(userId, { refreshToken: null });
    },
  });
};

export type UserRepositoryType = ReturnType<typeof createUserRepository>;
