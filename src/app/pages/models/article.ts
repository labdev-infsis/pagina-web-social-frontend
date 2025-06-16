import { MediaArticle } from "./media-article";

export interface Article {
    uuid:       string;
    section_id: string;
    user_id:    string;
    title:      string;
    text:       string;
    date:       string;
    medias:     MediaArticle[];
}