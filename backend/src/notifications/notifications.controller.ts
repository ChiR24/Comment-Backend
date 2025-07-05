import { Controller, Get, Post, Param, UseGuards, Request, HttpCode } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    return this.notificationsService.findAll(req.user as User);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/read')
  @HttpCode(204)
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user as User);
  }
}
