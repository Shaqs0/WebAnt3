import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Location, ApiResponse } from '../interfaces/locations';
import type { Character } from '../interfaces/character';
import { PREFIX } from '../helpers/API';

interface LocationsState {
  locations: Location[];
  selectedLocation: Location | null;
  residents: Character[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  currentPage: number;
  filters: {
    name: string;
    type: string;
    dimension: string;
  };
  filterOptions: {
    types: string[];
    dimensions: string[];
  };
}

const initialState: LocationsState = {
  locations: [],
  selectedLocation: null,
  residents: [],
  loading: false,
  hasMore: true,
  error: null,
  currentPage: 1,
  filters: {
    name: '',
    type: '',
    dimension: ''
  },
  filterOptions: {
    types: [],
    dimensions: []
  }
};

export const fetchLocations = createAsyncThunk(
  'locations/fetchLocations',
  async (page: number | undefined, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { locations: LocationsState };
      const { filters, currentPage } = state.locations;
      
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.type) params.append('type', filters.type);
      if (filters.dimension) params.append('dimension', filters.dimension);
      params.append('page', (page || currentPage).toString());
      
      const response = await fetch(`https://rickandmortyapi.com/api/location?${params}`);
      if (!response.ok) throw new Error('Failed to fetch locations');
      
      return await response.json() as ApiResponse;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

export const fetchLocationById = createAsyncThunk(
  'locations/fetchLocationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/location/${id}`);
      if (!response.ok) throw new Error('Location not found');
      
      return await response.json() as Location;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

export const fetchResidents = createAsyncThunk(
  'locations/fetchResidents',
  async (residentUrls: string[], { rejectWithValue }) => {
    try {
      if (residentUrls.length === 0) return [];
      
      const ids = residentUrls.map(url => url.split('/').pop()).join(',');
      const response = await fetch(`${PREFIX}/character/${ids}`);
      if (!response.ok) throw new Error('Failed to load residents');
      
      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

export const loadAllLocations = createAsyncThunk(
  'locations/loadAllLocations',
  async (_, { rejectWithValue }) => {
    try {
      let allLocations: Location[] = [];
      let nextPage = 1;
      
      while (nextPage) {
        const response = await fetch(`${PREFIX}/location?page=${nextPage}`);
        const data = await response.json() as ApiResponse;
        allLocations = [...allLocations, ...data.results];
        nextPage = data.info.next ? nextPage + 1 : 0;
      }
      
      return allLocations;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Unknown error');
    }
  }
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ 
      name: string; 
      value: string 
    }>) => {
      const { name, value } = action.payload;
      state.filters = { ...state.filters, [name]: value };
      state.currentPage = 1; 
      state.locations = []; 
      state.hasMore = true; 
    },
    resetFilters: (state) => {
      state.filters = {
        name: '',
        type: '',
        dimension: ''
      };
      state.currentPage = 1;
      state.locations = [];
      state.hasMore = true;
    },
    setFilterOptions: (state, action: PayloadAction<{
      types: string[];
      dimensions: string[];
    }>) => {
      state.filterOptions = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.meta.arg === 1 || state.currentPage === 1) {
          state.locations = action.payload.results;
          state.currentPage = 2; 
        } else {
          state.locations = [...state.locations, ...action.payload.results];
          state.currentPage += 1;
        }
        
        state.hasMore = !!action.payload.info.next;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.locations = []; 
      })
      .addCase(fetchLocationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLocation = action.payload;
      })
      .addCase(fetchLocationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchResidents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResidents.fulfilled, (state, action) => {
        state.loading = false;
        state.residents = action.payload;
      })
      .addCase(fetchResidents.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loadAllLocations.fulfilled, (state, action) => {
        const types = new Set<string>();
        const dimensions = new Set<string>();
        
        action.payload.forEach(loc => {
          if (loc.type) types.add(loc.type);
          if (loc.dimension) dimensions.add(loc.dimension);
        });
        
        state.filterOptions = {
          types: Array.from(types),
          dimensions: Array.from(dimensions)
        };
      });
  }
});

export const { setFilter, resetFilters, setFilterOptions } = locationsSlice.actions;
export default locationsSlice.reducer;