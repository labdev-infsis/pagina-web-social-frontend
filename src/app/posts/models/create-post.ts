import { Content } from "./content";

export interface CreatePost {
    institution_id:    string;
    date:              Date;
    comment_config_id: string;
    content:           Content;
}