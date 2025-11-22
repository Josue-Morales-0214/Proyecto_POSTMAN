export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface KeyValue {
  key: string;
  value: string;
}

export interface ApiRequest {
  url: string;
  method: HttpMethod;
  headers: KeyValue[];
  body: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  time: number;
  data: any;
  size: string;
}

// Agregamos esto nuevo:
export interface RequestHistoryItem extends ApiRequest {
  timestamp: Date;
}