import axios from 'axios';
import type { Character } from '../interfaces/character';
import { PREFIX } from '../helpers/API';

export interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

const BASE_URL = `${PREFIX}/character`;

export const fetchCharacters = async (
  params: Record<string, string>,
): Promise<ApiResponse> => {
  const response = await axios.get<ApiResponse>(BASE_URL, {
    params,
  });
  return response.data;
};