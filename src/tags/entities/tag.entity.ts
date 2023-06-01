import { PostEntity } from 'src/posts/entities/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity({ name: 'tags' })
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => PostEntity, (post) => post.tags)
  posts: PostEntity[];
}
