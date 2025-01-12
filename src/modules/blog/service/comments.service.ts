import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { BlogCommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dto/comment.dto';
import { NotFoundMessage, PublicMessage } from 'src/common/enums/message.enums';
import { BlogEntity } from '../entities/blog.entity';

@Injectable({ scope: Scope.REQUEST })
export class CommentsService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(BlogCommentEntity)
    private readonly commentsRepository: Repository<BlogCommentEntity>,
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) {}

  async toggleAccept(blogId: number, commentId: number) {
    const { id: authorId } = this.request.user;
    const blog = this.blogRepository.findOneBy({ authorId, id: blogId });
    if (!blog) throw new BadRequestException(PublicMessage.SomethingWentWrong);

    const comment = await this.commentsRepository.findOneBy({
      blogId,
      id: commentId,
    });

    if (!comment) throw new NotFoundException(NotFoundMessage.CommentNotFound);

    comment.accepted = !comment.accepted;
    await this.commentsRepository.save(comment);

    return {
      message: comment.accepted
        ? PublicMessage.CommentAccepted
        : PublicMessage.CommentRejected,
    };
  }

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
