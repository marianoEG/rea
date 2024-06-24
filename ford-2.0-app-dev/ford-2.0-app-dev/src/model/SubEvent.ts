import { BaseData } from "./BaseData";
import { Guest } from "./Guest";

export interface SubEvent extends BaseData {
    name?: string;
    dateFrom?: Date;
    dateTo?: Date;
    guestNumber?: number;
    image?: string;
    guests?: Guest[];
}