import { dateToSyncSaleForce } from './../../utils/functions';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GuestImport } from '../models/guest-import.model';
import { Guest } from '../models/guest.model';
import { PagedList } from '../models/paged-list.model';

@Injectable({
    providedIn: 'root'
})
export class GuestService {

    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient, private handler: HttpBackend) { }

    getGuests(pageNumber?: number, pageSize?: number, eventId?: number, subeventId?: number, searchText?: string, changedByQrscanner?: boolean): Observable<PagedList<Guest>> {
        let queries = new HttpParams();
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());
        if (eventId) queries = queries.append('eventId', eventId.toString());
        if (subeventId) queries = queries.append('subeventId', subeventId.toString());
        if (searchText) queries = queries.append('searchText', searchText);
        if (changedByQrscanner != null) queries = queries.append('changedByQrscanner', changedByQrscanner);

        return this.http.get<PagedList<Guest>>(this.BASE_URL + '/Guest/list', {
            params: queries
        });
    }

    getGuestById(eventId: number, subeventId: number, guestId: number): Observable<Guest> {
        return this.http.get<Guest>(this.BASE_URL + `/Guest/${eventId}/${subeventId}/${guestId}`);
    }

    createGuest(eventId: number, guest: Guest): Observable<Guest> {
        return this.http.post<Guest>(this.BASE_URL + `/Guest/${eventId}`, guest);
    }

    editGuest(eventId: number, guest: Guest): Observable<Guest> {
        return this.http.put<Guest>(this.BASE_URL + `/Guest/${eventId}`, guest);
    }

    deleteGuest(eventId: number, subeventId: number, guestId: number): Observable<void> {
        return this.http.delete<void>(this.BASE_URL + `/Guest/${eventId}/${subeventId}/${guestId}`);
    }

    deleteGuests(eventId: number, subeventId: number): Observable<void> {
        return this.http.delete<void>(this.BASE_URL + `/Guest/${eventId}/${subeventId}`);
    }

    importGuestList(guestList: GuestImport): Observable<void> {
        let formData = new FormData();
        formData.append('fileData', guestList.fileData);
        formData.append('eventId', guestList.eventId.toString());
        formData.append('subeventId', guestList.subeventId.toString());

        return this.http.post<void>(this.BASE_URL + `/Guest/import`, formData);
    }

    getQrUrl(guestId?: number): string {
        return this.BASE_URL + `/binary/guest/qr-data/${guestId}`;
    }

    downloadQr(guestId?: number): Observable<Blob> {
        return this.http.get(this.getQrUrl(guestId), { responseType: 'blob' });
    }

    sendToSaleForce(eventId?: number, subeventId?: number): Observable<void> {
        return this.http.post<void>(this.BASE_URL + `/Guest/sync-to-sale-force/${eventId}/${subeventId}`, { fechaIngreso: dateToSyncSaleForce(new Date()) });
    }
}
