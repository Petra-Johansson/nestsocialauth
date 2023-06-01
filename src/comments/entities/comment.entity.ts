import { ApiProperty } from '@nestjs/swagger';
import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'comments' })
export class CommentEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty({ type: () => PostEntity })
  @ManyToOne(() => PostEntity, (post) => post.comments)
  post: PostEntity;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.comments)
  user: UserEntity;
}
