import { ReactionsByType } from "./reactions-by-type";
import { ReactionsByUser } from "./reactions-by-user";

export interface Reactions {
    my_reaction_emoji: string;
    total_reactions:   number;
    reactions_by_type: ReactionsByType[];
    reactions_by_user: ReactionsByUser[];
}