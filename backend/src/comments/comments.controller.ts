import { Controller, Get, Post, Body, UseGuards, Request, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(createCommentDto, req.user as User);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    return this.commentsService.update(id, updateCommentDto, req.user as User);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(id, req.user as User);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/restore')
  @HttpCode(204)
  restore(@Param('id') id: string, @Request() req) {
    return this.commentsService.restore(id, req.user as User);
  }
}
