
export interface Comment {
    uuid: string;
    content: string;
    moderated: boolean;
    state: string;
    date: Date;
    user_name:  string;
    user_photo: string;
    reply_count: BigInt
}
