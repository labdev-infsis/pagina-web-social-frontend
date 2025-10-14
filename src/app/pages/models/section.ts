import { Article } from "./article";

export interface Section {
    uuid:           string;
    institution_id: string;
    user_id:        string;
    name:           string;
    date:           string;
    articles:       Article[];
}