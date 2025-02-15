
export interface Comment {
    uuid: string;
    content: string;
    moderated: boolean;
    state: string;
    date: Date;
    user_name:  string;
    user_photo: string;
    userId: string;
    reply_count: BigInt
    reactions?: any[];
    totalReactions?: number;
}
