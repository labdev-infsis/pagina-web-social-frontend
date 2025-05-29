import { Role } from "./role";

export interface User {
    uuid:               string;
    name:               string;
    lastName:           string;
    email:              string;
    password:           string;
    confirm_password:   string;
    phone?:             number;
    photoProfilePath?:  string;
    photoPortadaPath?:  string;
}