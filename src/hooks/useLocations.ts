import { useState, useEffect } from 'react';
import type { Location } from '../interfaces/locations'; 
import { getAllLocations, getUniqueTypesAndDimensions } from "../api/locationsApi";


export const useLocations = () => {
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [displayedLocations, setDisplayedLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    dimension: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    types: [] as string[],
    dimensions: [] as string[]
  });

  const LOAD_COUNT = 12;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const locations = await getAllLocations();
        setAllLocations(locations);
        setFilteredLocations(locations);
        
        const { types, dimensions } = getUniqueTypesAndDimensions(locations);
        setFilterOptions({ types, dimensions });
        
        setDisplayedLocations(locations.slice(0, LOAD_COUNT));
      } catch (err) {
        setError('Error loading locations. Please try again later.');
        console.error('Error loading locations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allLocations]);

  const applyFilters = () => {
    const { name, type, dimension } = filters;
    
    const filtered = allLocations.filter(loc =>
      (!name || loc.name.toLowerCase().includes(name.toLowerCase())) &&
      (!type || loc.type === type) &&
      (!dimension || loc.dimension === dimension)
    );

    setFilteredLocations(filtered);
    setDisplayedLocations(filtered.slice(0, LOAD_COUNT));
  };

  const loadMore = () => {
    const newCount = displayedLocations.length + LOAD_COUNT;
    setDisplayedLocations(filteredLocations.slice(0, newCount));
  };

  const updateFilter = (name: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    locations: displayedLocations,
    hasMore: displayedLocations.length < filteredLocations.length,
    isLoading,
    error,
    filterOptions,
    filters,
    updateFilter,
    loadMore
  };
};
