import { PREFIX } from "../helpers/API";

export const fetchEpisodes = async (params: Record<string, string>): Promise<Response> => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${PREFIX}/episode?${queryString}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch episodes');
  }
  
  return response;
};