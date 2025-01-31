import { Content } from "./content";

export interface CreatePost {
    institution_id:    string;
    date:              string;
    comment_config_id: string;
    content:           Content;
}