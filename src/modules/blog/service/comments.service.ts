import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { BlogCommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class CommentsService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(BlogCommentEntity)
    private readonly commentsRepository: Repository<BlogCommentEntity>,
  ) {}
}
