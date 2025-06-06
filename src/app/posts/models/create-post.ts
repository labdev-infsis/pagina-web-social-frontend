import { Content } from "./content";

export interface CreatePost {
    institution_id:    string;
    date:              string;
    comment_config_id: string;
    content:           Content;
    is_fb_posted: boolean;
    fb_post_enable: boolean;
}