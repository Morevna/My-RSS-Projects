// src/api/types.ts

export interface UserPayload {
  login: string;
  isLogined: boolean;
}

export interface ErrorPayload {
  error: string;
}

export interface ServerResponse {
  id: string;
  type: string;
  payload: {
    user?: UserPayload;
    error?: string;
  };
}
