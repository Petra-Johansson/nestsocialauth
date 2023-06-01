import { TagEntity } from '../entities/tag.entity';

export interface TagResponseInterface {
  tags: TagEntity[];
  tagsCounts: number;
}
