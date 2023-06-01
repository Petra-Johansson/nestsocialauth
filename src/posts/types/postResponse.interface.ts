//import { PostEntity } from "../entities/post.entity";
import { PostType } from "./post.type";

export interface PostResponseInterface{
    posts: PostType[],
    postsCount: number,
}