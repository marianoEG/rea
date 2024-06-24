import { Nullable } from "../../utils/constants";

export class Session {
    id: Nullable<number>
    email: Nullable<string>
    firstname: Nullable<string>
    lastname: Nullable<string>
    profile: Nullable<string>
    clientName: Nullable<string>
    userId: Nullable<string>
    token: Nullable<string>
    startDate: Nullable<Date>
    expirationDate: Nullable<Date>
    endDate: Nullable<Date>
}