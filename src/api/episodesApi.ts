import type { Episode } from "../interfaces/episode";

export const fetchEpisode = async (id: string): Promise<Episode> => {
  const response = await fetch(`https://rickandmortyapi.com/api/episode/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch episode');
  }
  
  return response.json();
};

export const fetchEpisodes = async (params: Record<string, string> = {}): Promise<{ results: Episode[] }> => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`https://rickandmortyapi.com/api/episode?${queryString}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch episodes');
  }
  
  return response.json();
};