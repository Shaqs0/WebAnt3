export interface Location {
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: string[];
}

export interface ApiResponse {
  info: {
    next: string | null;
  };
  results: Location[];
}