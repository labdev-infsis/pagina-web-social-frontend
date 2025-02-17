
export interface Comment {
    uuid: string;
    content: string;
    moderated: boolean;
    state: string;
    date: string;
    user_name:  string;
    user_photo: string;
    userId: string;
    reply_count: number;
    reactions?: any[];
    totalReactions?: number;

}
