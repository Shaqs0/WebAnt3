import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Episode, ApiResponse } from '../interfaces/episode';
import type { Character } from '../interfaces/character';

interface EpisodesState {
  episodes: Episode[];
  selectedEpisode: Episode | null;
  charactersInEpisode: Character[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  currentPage: number;
  searchQuery: string;
}

const initialState: EpisodesState = {
  episodes: [],
  selectedEpisode: null,
  charactersInEpisode: [],
  loading: false,
  hasMore: true,
  error: null,
  currentPage: 1,
  searchQuery: '',
};

export const fetchEpisodes = createAsyncThunk(
  'episodes/fetchEpisodes',
  async ({ searchQuery, page }: { searchQuery: string; page: number }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('name', searchQuery);
      params.append('page', page.toString());
      
      const response = await fetch(`https://rickandmortyapi.com/api/episode?${params}`);
      if (!response.ok) throw new Error('Failed to fetch episodes');
      
      return await response.json() as ApiResponse;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

export const fetchEpisodeById = createAsyncThunk(
  'episodes/fetchEpisodeById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/episode/${id}`);
      if (!response.ok) throw new Error('Episode not found');
      
      return await response.json() as Episode;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

export const fetchCharactersInEpisode = createAsyncThunk(
  'episodes/fetchCharactersInEpisode',
  async (characterUrls: string[], { rejectWithValue }) => {
    try {
      const ids = characterUrls.map(url => url.split('/').pop()).join(',');
      const response = await fetch(`https://rickandmortyapi.com/api/character/${ids}`);
      if (!response.ok) throw new Error('Failed to load characters');
      
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

const episodesSlice = createSlice({
  name: 'episodes',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; 
      state.episodes = []; 
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetEpisodes: (state) => {
      state.episodes = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpisodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.loading = false;
        state.episodes = state.currentPage === 1 
          ? action.payload.results 
          : [...state.episodes, ...action.payload.results];
        state.hasMore = !!action.payload.info.next;
      })
      .addCase(fetchEpisodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.episodes = [];
      })
      .addCase(fetchEpisodeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpisodeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEpisode = action.payload;
      })
      .addCase(fetchEpisodeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCharactersInEpisode.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCharactersInEpisode.fulfilled, (state, action) => {
        state.loading = false;
        state.charactersInEpisode = action.payload;
      })
      .addCase(fetchCharactersInEpisode.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSearchQuery, setPage, resetEpisodes } = episodesSlice.actions;
export default episodesSlice.reducer;