export type UserType = 'pro' | 'regular';

export const USER_TYPES: UserType[] = ['pro', 'regular'];

export interface User {
  name: string;
  email: string;
  avatarUrl: string;
  type: UserType;
}
