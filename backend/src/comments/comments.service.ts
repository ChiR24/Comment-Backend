import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const { content, parentId } = createCommentDto;
    const commentData: Partial<Comment> = {
      content,
      user,
    };

    if (parentId) {
      const parent = await this.commentRepository.findOneBy({ id: parentId });
      if (!parent) {
        throw new NotFoundException(`Parent comment with ID "${parentId}" not found`);
      }
      commentData.parent = parent;
    }

    const comment = this.commentRepository.create(commentData);
    return this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({
      relations: ['user', 'replies', 'replies.user'],
      where: { parent: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user: User): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['user'] });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }

    if (comment.user.id !== user.id) {
      throw new ForbiddenException('You are not allowed to edit this comment');
    }

    const now = new Date();
    const createdAt = new Date(comment.createdAt);
    const diffInMinutes = (now.getTime() - createdAt.getTime()) / 60000;

    if (diffInMinutes > 15) {
      throw new ForbiddenException('You can only edit comments within 15 minutes of posting');
    }

    comment.content = updateCommentDto.content;
    return this.commentRepository.save(comment);
  }

  async remove(id: string, user: User): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['user'] });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }

    if (comment.user.id !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    const now = new Date();
    const createdAt = new Date(comment.createdAt);
    const diffInMinutes = (now.getTime() - createdAt.getTime()) / 60000;

    if (diffInMinutes > 15) {
      throw new ForbiddenException('You can only delete comments within 15 minutes of posting');
    }

    await this.commentRepository.softDelete(id);
  }

  async restore(id: string, user: User): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }

    if (comment.user.id !== user.id) {
      throw new ForbiddenException('You are not allowed to restore this comment');
    }

    const now = new Date();
    const deletedAt = new Date(comment.deletedAt);
    const diffInMinutes = (now.getTime() - deletedAt.getTime()) / 60000;

    if (diffInMinutes > 15) {
      throw new ForbiddenException('You can only restore comments within 15 minutes of deletion');
    }

    await this.commentRepository.restore(id);
  }
}
