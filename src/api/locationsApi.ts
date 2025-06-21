import { PREFIX } from "../helpers/API";
import type { Location, ApiResponse } from "../interfaces/locations";


export const fetchLocations = async (page = 1): Promise<ApiResponse> => {
  const res = await fetch(`${PREFIX}/location?page=${page}`);
  const data = await res.json();
  return data;
};

export const getAllLocations = async (): Promise<Location[]> => {
  let allLocations: Location[] = [];
  let nextPage: number | null = 1;
  
  while (nextPage) {
    const { info, results } = await fetchLocations(nextPage);
    allLocations.push(...results);
    nextPage = info.next ? parseInt(new URL(info.next).searchParams.get('page') || '0') : null;
  }
  
  return allLocations;
};

export const getUniqueTypesAndDimensions = (locations: Location[]) => {
  const types = new Set<string>();
  const dimensions = new Set<string>();

  locations.forEach(loc => {
    if (loc.type) types.add(loc.type);
    if (loc.dimension) dimensions.add(loc.dimension);
  });

  return {
    types: Array.from(types),
    dimensions: Array.from(dimensions)
  };
};