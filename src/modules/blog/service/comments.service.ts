import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { BlogCommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dto/comment.dto';
import { PublicMessage } from 'src/common/enums/message.enums';

@Injectable({ scope: Scope.REQUEST })
export class CommentsService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(BlogCommentEntity)
    private readonly commentsRepository: Repository<BlogCommentEntity>,
  ) {}

  async create(commentDto: CreateCommentDto) {
    const { id: userId } = this.request.user;
    const { text, parentId, blogId } = commentDto;
    let parent: BlogCommentEntity | null = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.commentsRepository.findOneBy({ id: +parentId });
    }
    const comment = this.commentsRepository.create({
      text,
      parentId: parent ? parent.id : null,
      blogId,
      userId,
      accepted: true,
    });
    await this.commentsRepository.save(comment);

    return {
      message: PublicMessage.CommentCreated,
      data: comment,
    };
  }
}
