import { generateUid } from '@book-rental-app/shared/utils';
import create from 'zustand';

interface NotificationsStore {
	_id: string | null;
	message: string | null;
	type: 'success' | 'error' | null;
	duration?: number | null;
	visible: boolean;

	showNotification(
		message: string,
		type: 'success' | 'error',
		duration?: number
	): void;
	showErrorNotification(message: string, duration?: number): void;
	showSuccessNotification(message: string, duration?: number): void;
}

const useNotifications = create<NotificationsStore>((set, get) => ({
	_id: null,
	message: null,
	type: null,
	duration: null,
	visible: false,

	showNotification(message: string, type: 'success' | 'error', duration = 4) {
		const id = generateUid(10);

		set({
			message,
			type,
			duration,
			visible: true,
			_id: id,
		});

		setTimeout(() => {
			if (get()._id !== id) return;

			set({
				visible: false,
				_id: null,
			});
		}, duration * 1000);
	},
	showErrorNotification(message: string, duration) {
		get().showNotification(message, 'error', duration);
	},
	showSuccessNotification(message: string, duration) {
		get().showNotification(message, 'success', duration);
	},
}));

export default useNotifications;
