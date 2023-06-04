import { IsNotEmpty, Length } from 'class-validator';
import { CommentEntity } from 'src/comments/entities/comment.entity';
import { TagEntity } from 'src/tags/entities/tag.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @Column()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.posts, { eager: true })
  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.posts)
  @JoinTable()
  @ApiPropertyOptional({ type: () => [TagEntity] })
  tags: TagEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  @ApiPropertyOptional({ type: () => [CommentEntity] })
  comments: CommentEntity[];

  @Column({ default: 0 })
  @ApiPropertyOptional()
  likes: number;

  @ApiProperty({ type: () => [UserEntity] })
  @ManyToMany(() => UserEntity)
  @JoinTable()
  likedBy: UserEntity[];

  @Column()
  @ApiPropertyOptional()
  slug: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
