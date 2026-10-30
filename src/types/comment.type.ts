import type { User } from './user.type.js';

export interface Comment {
  id: string;
  text: string;
  rating: number;
  publicationDate: string;
  author: User;
}
