//src\api\types.ts
// -------------------- User --------------------
export interface User {
  login: string;
  isLogined: boolean;
  unread?: number;
}

export interface UserLoginPayload {
  user: User;
}

export interface UsersListPayload {
  users: User[];
}

// -------------------- Message --------------------
export interface MessageStatus {
  isDelivered?: boolean;
  isReaded?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: MessageStatus;
}

export interface MessagePayload {
  message: Message;
}

export interface MessageListPayload {
  messages: Message[];
}

export interface CountPayload {
  count: number;
}

export interface ErrorPayload {
  error: string;
}

// -------------------- Server --------------------
export type ServerEventType =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_ACTIVE'
  | 'USER_INACTIVE'
  | 'USER_EXTERNAL_LOGIN'
  | 'USER_EXTERNAL_LOGOUT'
  | 'MSG_SEND'
  | 'MSG_FROM_USER'
  | 'MSG_COUNT_NOT_READED_FROM_USER'
  | 'MSG_DELIVER'
  | 'MSG_READ'
  | 'MSG_EDIT'
  | 'MSG_DELETE'
  | 'ERROR';

export type ServerResponsePayload =
  | UserLoginPayload
  | UsersListPayload
  | MessagePayload
  | MessageListPayload
  | CountPayload
  | ErrorPayload;

export interface ServerResponse<T = ServerResponsePayload> {
  id: string | null;
  type: ServerEventType;
  payload: T;
}
