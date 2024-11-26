import { Content } from "./content";

export interface Post {
    uuid:              string;
    institution_id:    string;
    user_id:           string;
    comment_config_id: string;
    date:              Date;
    content:           Content;
}