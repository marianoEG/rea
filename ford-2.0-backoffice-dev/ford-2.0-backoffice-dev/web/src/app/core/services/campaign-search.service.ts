import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CampaignSearch } from '../models/campaign-search.model';
import { PagedList } from '../models/paged-list.model';

@Injectable({
    providedIn: 'root'
})
export class CampaignSearchService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getCampaignSearches(searchText?: string, pageNumber?: number, pageSize?: number, eventId?: number, searchDateFrom?: string, searchDateTo?: string): Observable<PagedList<CampaignSearch>> {
        let queries = new HttpParams();
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());
        if (eventId) queries = queries.append('eventId', eventId.toString());
        if (searchDateFrom) queries = queries.append('searchDateFrom', searchDateFrom.toString());
        if (searchDateTo) queries = queries.append('searchDateTo', searchDateTo.toString());
        return this.http.get<PagedList<CampaignSearch>>(this.BASE_URL + '/CampaignSearch/list', {
            params: queries
        });
    }

}