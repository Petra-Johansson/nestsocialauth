import { PostEntity } from "../entities/post.entity";

export type PostType = Omit<PostEntity, 'updateTimestamp'>;