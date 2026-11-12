import { CommentEntity } from '../models/index.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

export interface CommentService {
  create(comment: CreateCommentDto): Promise<CommentEntity>;
  findByOfferId(offerId: string): Promise<CommentEntity[]>;
}
