import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dealership } from '../models/dealership.model';
import { PagedList } from '../models/paged-list.model';

@Injectable({
    providedIn: 'root'
})
export class DealershipService {

    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getDealerships(searchText?: string, pageNumber?: number, pageSize?: number, provinceId?: number, cityId?: number): Observable<PagedList<Dealership>> {
        let queries = new HttpParams();
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());
        if (provinceId) queries = queries.append('provinceId', provinceId.toString());
        if (cityId) queries = queries.append('cityId', cityId.toString());

        return this.http.get<PagedList<Dealership>>(this.BASE_URL + '/Dealership/list', {
            params: queries
        });
    }

    getDealershipById(dealershipId: number): Observable<Dealership> {
        return this.http.get<Dealership>(this.BASE_URL + `/Dealership/${dealershipId}`);
    }

    createDealership(dealership: Dealership): Observable<Dealership> {
        return this.http.post<Dealership>(this.BASE_URL + '/Dealership', dealership);
    }

    editDealership(dealership: Dealership): Observable<Dealership> {
        return this.http.put<Dealership>(this.BASE_URL + '/Dealership', dealership);
    }

    deleteDealership(dealershipId: number): Observable<void> {
        return this.http.delete<void>(this.BASE_URL + `/Dealership/${dealershipId}`);
    }

    deleteDealerships(dealershipIds: number[]): Observable<void> {
        let params = new HttpParams();
        params = params.append('dealershipIds', dealershipIds.join(','));
        return this.http.delete<void>(this.BASE_URL + `/Dealership/delete-all`, { params });
    }

    importDealershipList(dealershipList: File): Observable<void> {
        let formData = new FormData();
        formData.append('fileData', dealershipList);

        return this.http.post<void>(this.BASE_URL + `/Dealership/import`, formData);
    }
}
