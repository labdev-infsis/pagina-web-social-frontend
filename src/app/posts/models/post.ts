import { CommentCounter } from "./comment-counter";
import { Content } from "./content";
import { Reactions } from "./reactions";

export interface Post {
    uuid:              string;
    institution_id:    string;
    user_id:           string;
    comment_config_id: string;
    date:              string;
    content:           Content;
    reactions:         Reactions;
    commentCounter:    CommentCounter;
}