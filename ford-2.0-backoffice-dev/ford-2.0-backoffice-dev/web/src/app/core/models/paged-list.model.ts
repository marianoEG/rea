import { Nullable } from "src/app/utils/constants";

export class PagedList<T> {
    public listOfEntities: Nullable<Array<T>>;
    public pageSize: Nullable<number>;
    public currentPage: Nullable<number>;
    public totalItems: Nullable<number>;
    public totalPages: Nullable<number>;
    public isLastPage: Nullable<boolean>;
    public isValidPage: Nullable<boolean>;
} 