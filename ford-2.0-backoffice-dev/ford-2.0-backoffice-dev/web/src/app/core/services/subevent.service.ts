import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedList } from '../models/paged-list.model';
import { Subevent } from '../models/subevent.model';

@Injectable({
    providedIn: 'root'
})
export class SubeventService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getSubevents(searchText?: string, pageNumber?: number, pageSize?: number, eventId?: number): Observable<PagedList<Subevent>> {
        let queries = new HttpParams();
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());
        if (eventId) queries = queries.append('eventId', eventId.toString());

        return this.http.get<PagedList<Subevent>>(this.BASE_URL + '/SubEvent/list', {
            params: queries
        });
    }

    getSubeventById(eventId: number, subeventId: number): Observable<Subevent> {
        return this.http.get<Subevent>(this.BASE_URL + `/SubEvent/${eventId}/${subeventId}`);
    }

    createSubevent(Subevent: Subevent): Observable<Subevent> {
        return this.http.post<Subevent>(this.BASE_URL + '/SubEvent', Subevent);
    }

    editSubevent(Subevent: Subevent): Observable<Subevent> {
        return this.http.put<Subevent>(this.BASE_URL + '/SubEvent', Subevent);
    }

    deleteSubevent(eventId: number, subeventId: number): Observable<void> {
        return this.http.delete<void>(this.BASE_URL + `/SubEvent/${eventId}/${subeventId}`);
    }
}
