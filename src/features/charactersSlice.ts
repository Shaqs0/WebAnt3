import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchCharacters } from '../api/characterApi';
import type { Character, ApiResponse } from '../interfaces/character';

interface CharactersState {
  characters: Character[];
  selectedCharacter: Character | null;
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  filters: {
    name: string;
    species: string;
    gender: string;
    status: string;
  };
  page: number;
}

const initialState: CharactersState = {
  characters: [],
  selectedCharacter: null,
  loading: false,
  hasMore: true,
  error: null,
  filters: {
    name: '',
    species: '',
    gender: '',
    status: '',
  },
  page: 1,
};

export const fetchCharactersThunk = createAsyncThunk(
  'characters/fetchCharacters',
  async (params: { filters: Record<string, string>; page: number }, { rejectWithValue }) => {
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(params.filters).filter(([_, value]) => value.trim() !== '')
      );
      const response = await fetchCharacters({ ...activeFilters, page: params.page.toString() });
      return response;
    } catch (err) {
      return rejectWithValue('Failed to load characters');
    }
  }
);

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<CharactersState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSelectedCharacter(state, action: PayloadAction<Character | null>) {
      state.selectedCharacter = action.payload;
    },
    resetCharacters(state) {
      state.characters = [];
      state.hasMore = true;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharactersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharactersThunk.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.characters =
          state.page === 1
            ? action.payload.results
            : [...state.characters, ...action.payload.results];
        state.hasMore = action.payload.info.next !== null;
      })
      .addCase(fetchCharactersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.characters = [];
      });
  },
});

export const { 
  setFilters, 
  setPage, 
  setSelectedCharacter, 
  resetCharacters,
  resetFilters
} = charactersSlice.actions;
export default charactersSlice.reducer;