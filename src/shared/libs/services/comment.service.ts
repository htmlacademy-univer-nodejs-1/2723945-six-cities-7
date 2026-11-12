import { inject, injectable } from 'inversify';

import { Component } from '../../types/index.js';
import { CommentEntity } from '../models/index.js';
import { CommentRepository, OfferRepository } from '../repositories/index.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentRepository)
    private readonly commentRepository: CommentRepository,

    @inject(Component.OfferRepository)
    private readonly offerRepository: OfferRepository,
  ) { }

  public async create(comment: CreateCommentDto): Promise<CommentEntity> {
    const offerId = String(comment.offer);
    const offer = await this.offerRepository.findById(offerId);

    if (!offer) {
      throw new Error('Offer not found');
    }

    const newComment = await this.commentRepository.create({
      ...comment,
    });

    const comments = await this.commentRepository.findByOfferId(offerId);

    const commentsCount = comments.length;
    const rating = Number(
      (comments.reduce((sum, item) => sum + item.rating, 0) / commentsCount).toFixed(1)
    );

    await this.offerRepository.update(offerId, {
      commentsCount,
      rating,
    });

    return newComment;
  }

  public async findByOfferId(offerId: string): Promise<CommentEntity[]> {
    return this.commentRepository.findByOfferId(offerId);
  }
}
