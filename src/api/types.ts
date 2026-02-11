// src/api/types.ts

export interface User {
  login: string;
  isLogined: boolean;
  unread?: number;
}

export interface MessageStatus {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
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

export interface UserPayload {
  user: User;
}
export interface UsersListPayload {
  users: User[];
}
export interface MessagePayload {
  message: Message;
}
export interface MessagesHistoryPayload {
  messages: Message[];
}
export interface UnreadCountPayload {
  count: number;
}
export interface ErrorPayload {
  error: string;
}

export interface StatusPayload {
  message: {
    id: string;
    status: Partial<MessageStatus>;
  };
}

export type ServerResponse =
  | { id: string | null; type: 'USER_LOGIN'; payload: UserPayload }
  | { id: string | null; type: 'USER_LOGOUT'; payload: UserPayload }
  | { id: string | null; type: 'USER_EXTERNAL_LOGIN'; payload: UserPayload }
  | { id: string | null; type: 'USER_EXTERNAL_LOGOUT'; payload: UserPayload }
  | { id: string | null; type: 'USER_ACTIVE'; payload: UsersListPayload }
  | { id: string | null; type: 'USER_INACTIVE'; payload: UsersListPayload }
  | { id: string | null; type: 'MSG_SEND'; payload: MessagePayload }
  | {
      id: string | null;
      type: 'MSG_FROM_USER';
      payload: MessagesHistoryPayload;
    }
  | { id: string | null; type: 'MSG_DELIVER'; payload: StatusPayload }
  | { id: string | null; type: 'MSG_READ'; payload: StatusPayload }
  | { id: string | null; type: 'MSG_DELETE'; payload: StatusPayload }
  | { id: string | null; type: 'MSG_EDIT'; payload: MessagePayload }
  | {
      id: string | null;
      type: 'MSG_COUNT_NOT_READED_FROM_USER';
      payload: UnreadCountPayload;
    }
  | { id: string | null; type: 'ERROR'; payload: ErrorPayload };
