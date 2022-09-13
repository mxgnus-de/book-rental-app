import {
	UserPermissions,
	UserWithoutPassword,
} from '@book-rental-app/shared/types';
import { User } from '@prisma/client';

export class UserPermission {
	private perms: UserPermissions[] = [];
	private permsString = '';

	constructor(perms: string | UserWithoutPassword | User) {
		this.permsString = typeof perms === 'string' ? perms : perms.permissions;
		this.parsePermissions();
	}

	public parsePermissions(permsString?: string) {
		this.perms = (permsString || this.permsString)
			.split(';')
			.map((perm) => perm.trim()) as UserPermissions[];
		return this.perms;
	}

	public stringifyPermissions(perms?: UserPermissions[]) {
		this.permsString = (perms || this.perms).join(';');
		return this.permsString;
	}

	public addPermission(perm: UserPermissions) {
		if (this.perms.includes(perm)) return this.perms;
		this.perms.push(perm);
		this.stringifyPermissions();
		return this.perms;
	}

	public removePermission(perm: UserPermissions) {
		if (!this.perms.includes(perm)) return this.perms;
		this.perms = this.perms.filter((p) => p !== perm);
		this.stringifyPermissions();
		return this.perms;
	}

	public hasPermission(perm: UserPermissions) {
		return this.perms.includes('ADMIN') || this.perms.includes(perm);
	}

	public hasSomePermission(perms: UserPermissions[]) {
		return perms.some((perm) => this.hasPermission(perm));
	}

	public hasEveryPermissions(perms: UserPermissions[]) {
		return perms.every((perm) => this.hasPermission(perm));
	}
}
