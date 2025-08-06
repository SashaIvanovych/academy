import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Factory function to create a custom user repository.
 * @param dataSource - TypeORM DataSource instance.
 * @returns Custom user repository with extended methods.
 */
export const createUserRepository = (dataSource: DataSource) => {
  return dataSource.getRepository(User).extend({
    /**
     * Find a user by email.
     * @param email - User's email.
     * @returns User entity or undefined if not found.
     */
    async findByEmail(email: string): Promise<User | undefined> {
      return this.findOne({ where: { email } });
    },

    /**
     * Register a new user with hashed password.
     * @param email - User's email.
     * @param password - User's plain text password.
     * @returns Created user entity.
     * @throws ConflictException if email is already in use.
     */
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

    /**
     * Validate user credentials.
     * @param email - User's email.
     * @param password - User's plain text password.
     * @returns User entity if valid, null otherwise.
     */
    async validateUser(email: string, password: string): Promise<User | null> {
      const user = await this.findByEmail(email);
      if (!user) {
        return null;
      }

      const isPasswordValid = await user.validatePassword(password);
      return isPasswordValid ? user : null;
    },

    /**
     * Save a refresh token for a user.
     * @param userId - User's ID.
     * @param refreshToken - Refresh token to save.
     */
    async saveRefreshToken(
      userId: string,
      refreshToken: string,
    ): Promise<void> {
      await this.update(userId, { refreshToken });
    },

    /**
     * Find a user by refresh token.
     * @param refreshToken - Refresh token to search for.
     * @returns User entity or undefined if not found.
     */
    async findByRefreshToken(refreshToken: string): Promise<User | undefined> {
      return this.findOne({ where: { refreshToken } });
    },

    /**
     * Clear a user's refresh token.
     * @param userId - User's ID.
     */
    async clearRefreshToken(userId: string): Promise<void> {
      await this.update(userId, { refreshToken: null });
    },
  });
};

export type UserRepositoryType = ReturnType<typeof createUserRepository>;
