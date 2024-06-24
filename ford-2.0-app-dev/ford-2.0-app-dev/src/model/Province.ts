import { BaseData } from "./BaseData";
import { Locality } from "./Locality";

export interface Province extends BaseData {
    name?: string;
    localities?: Locality[];
}