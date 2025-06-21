import axios from 'axios';
import type { ApiResponse } from '../interfaces/character';
import { PREFIX } from '../helpers/API';


const BASE_URL = `${PREFIX}/character`;

export const fetchCharacters = async (
  params: Record<string, string>,
): Promise<ApiResponse> => {
  const response = await axios.get<ApiResponse>(BASE_URL, {
    params,
  });
  return response.data;
};