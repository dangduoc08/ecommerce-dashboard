export interface IApiError {
  reason: string
  field: string
  namespace: string
}

export interface IApiResponse<T> {
  data?: T
  code?: string
  error?: string
  message?: string
  messages?: Array<IApiError>
}

export interface IAuthSessionToken {
  exp: number;
  token: string;
  type: string;
}

export interface IAuthSession {
  access: IAuthSessionToken;
  refresh: IAuthSessionToken;
  user: IUser;
}

export interface IUser {
  id: number;
  store_id: number;
  email: string;
  first_name: string;
  last_name: string;
  permissions: Array<any>;
}