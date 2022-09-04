import create from 'zustand';

interface SearchStore {
	search: string;
	setSearch: (search: string) => void;
}

const useSearch = create<SearchStore>((set) => ({
	search: '',
	setSearch: (search) => set({ search }),
}));

export default useSearch