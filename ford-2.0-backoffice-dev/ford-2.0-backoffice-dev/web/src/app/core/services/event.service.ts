import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Event } from '../models/event.model';
import { PagedList } from '../models/paged-list.model';

@Injectable({
    providedIn: 'root'
})
export class EventService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getEvents(searchText?: string, pageNumber?: number, pageSize?: number): Observable<PagedList<Event>> {
        let queries = new HttpParams();
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());

        return this.http.get<PagedList<Event>>(this.BASE_URL + '/Event/list', {
            params: queries
        });
    }

    getEventById(eventId: number): Observable<Event> {
        return this.http.get<Event>(this.BASE_URL + `/Event/${eventId}`);
    }

    createEvent(event: Event): Observable<Event> {
        return this.http.post<Event>(this.BASE_URL + '/Event', event);
    }

    editEvent(event: Event): Observable<Event> {
        return this.http.put<Event>(this.BASE_URL + '/Event', event);
    }

    deleteEvent(eventId: number): Observable<void> {
        return this.http.delete<void>(this.BASE_URL + `/Event/${eventId}`);
    }
}
