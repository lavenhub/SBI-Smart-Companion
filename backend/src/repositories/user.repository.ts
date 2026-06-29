import { Prisma, User } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationQuery } from '../types';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { phone } });
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    const isEmail = identifier.includes('@');
    return isEmail
      ? this.findByEmail(identifier)
      : this.findByPhone(identifier);
  }

  async findByCustomerId(customerId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { customerId } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async incrementFailedLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { failedLoginCount: { increment: 1 } },
    });
  }

  async resetFailedLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() },
    });
  }

  async lockAccount(id: string, until: Date): Promise<void> {
    await prisma.user.update({ where: { id }, data: { lockedUntil: until } });
  }

  async findAll(
    pagination: PaginationQuery,
    where?: Prisma.UserWhereInput,
  ): Promise<{ users: User[]; total: number }> {
    const { page, pageSize, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.user.count({ where }),
    ]);
    return { users, total };
  }

  async getSafeProfile(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true, customerId: true, firstName: true, lastName: true,
        email: true, phone: true, role: true, kycStatus: true,
        isActive: true, isPhoneVerified: true, isEmailVerified: true,
        avatarUrl: true, dateOfBirth: true, gender: true, occupation: true,
        addressLine1: true, addressLine2: true, city: true, state: true,
        pincode: true, country: true, lastLoginAt: true, createdAt: true,
      },
    });
  }
}
