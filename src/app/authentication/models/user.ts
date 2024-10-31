import { Role } from "./role";

export class User {
    id?: number;
    name?: string;
    phone?: number;
    password?: string;
    password_confirmation?: string;
    old_password?: string;
}