import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PostEntity } from 'src/posts/entities/post.entity';
import { CommentEntity } from 'src/comments/entities/comment.entity';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  phone: string;

  @ApiProperty()
  @Column({ default: 'not set' })
  contractNumber: string;

  @ApiPropertyOptional()
  @Column({ default: 'no picture' })
  image: string;

  @ApiProperty()
  @Column('text', { array: true, default: () => "array['user']" })
  roles: string[];

  @ApiHideProperty()
  @Column({ select: false })
  password: string;
  @BeforeInsert()
  async passwordHash() {
    //standard number for rounds of salting: 10
    this.password = await bcrypt.hash(this.password, 10);
  }

  @ApiProperty({ type: () => [PostEntity] })
  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @ApiProperty({ type: () => [CommentEntity] })
  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @ApiProperty({ type: () => [PostEntity] })
  @ManyToMany(() => PostEntity)
  @JoinTable()
  liked: PostEntity[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
