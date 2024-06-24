import { Nullable } from "src/app/utils/constants";

export class Feature {
    id: Nullable<number>
    name: Nullable<string>
    valueToWork: Nullable<string>
    order: Nullable<number>;

    // Front Stuffs
    isHover: boolean;
}