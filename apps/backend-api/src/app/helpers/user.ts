import { UserWithoutPassword } from '@book-rental-app/shared/types';
import { User } from '@prisma/client';

export function normalizeUser(user: User): UserWithoutPassword {
	return {
		userId: user.userId,
		username: user.username,
		surname: user.surname,
		lastname: user.lastname,
		email: user.email,
		createdAt: user.createdAt,
		birthday: user.birthday,
		isVerified: user.isVerified,
		permissions: user.permissions,
		isDeactivated: user.isDeactivated,
	};
}
