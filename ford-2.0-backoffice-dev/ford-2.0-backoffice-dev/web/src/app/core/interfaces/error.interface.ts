import { Nullable } from "src/app/utils/constants";

export interface IError {
    Code: Nullable<string>;
    Message: Nullable<string>;
}