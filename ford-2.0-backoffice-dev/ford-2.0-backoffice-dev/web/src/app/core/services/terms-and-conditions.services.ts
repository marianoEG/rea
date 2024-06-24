import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedList } from '../models/paged-list.model';
import { Subevent } from '../models/SubEvent.model';
import { TermsAndConditions } from '../models/terms-and-conditions.model';

@Injectable({
    providedIn: 'root'
})
export class TermsAndConditionsService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    createTermsAndConditions(termsAndConditions: TermsAndConditions): Observable<TermsAndConditions> {
        return this.http.post<TermsAndConditions>(this.BASE_URL + '/TermsAndConditions', termsAndConditions);
    }

    getLatestTermsAndConditions(): Observable<TermsAndConditions> {
        return this.http.get<TermsAndConditions>(this.BASE_URL + `/TermsAndConditions/latest`);
    }

}
