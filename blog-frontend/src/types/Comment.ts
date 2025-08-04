import { User } from "./User";
import { PostType } from "./Post";

export interface CommentType {
  id: string;
  commentText: string;
  post: string | PostType;
  author: string | User;
  createdAt: string;
  updatedAt: string;
}
