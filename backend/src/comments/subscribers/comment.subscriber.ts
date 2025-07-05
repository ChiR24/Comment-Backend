import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@EventSubscriber()
export class CommentSubscriber implements EntitySubscriberInterface<Comment> {
  listenTo() {
    return Comment;
  }

  async afterInsert(event: InsertEvent<Comment>) {
    const { entity, manager } = event;
    if (entity.parent) {
      const parentComment = await manager.findOne(Comment, {
        where: { id: entity.parent.id },
        relations: ['user'],
      });
      if (parentComment && parentComment.user.id !== entity.user.id) {
        const notification = manager.create(Notification, {
          user: parentComment.user,
          comment: entity,
        });
        await manager.save(notification);
      }
    }
  }
} 