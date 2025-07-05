import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async findAll(user: User): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: user.id } },
      relations: ['comment', 'comment.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string, user: User): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (notification) {
      notification.read = true;
      await this.notificationRepository.save(notification);
    }
  }
}
