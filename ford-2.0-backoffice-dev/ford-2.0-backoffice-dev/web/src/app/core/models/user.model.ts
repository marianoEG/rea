import { Nullable } from "src/app/utils/constants";

export class User {
    id: Nullable<string>
    firstname: Nullable<string>
    lastname: Nullable<string>
    email: Nullable<string>
    password: Nullable<string>
    profile: Nullable<string>
}