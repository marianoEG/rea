import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GeneralConfiguration } from '../models/general-configuration.model';
import { GuestImport } from '../models/guest-import.model';
import { Guest } from '../models/guest.model';
import { PagedList } from '../models/paged-list.model';
import { Subevent } from '../models/SubEvent.model';

@Injectable({
    providedIn: 'root'
})
export class GeneralConfigurationService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getConfigurations(): Observable<GeneralConfiguration[]> {
        return this.http.get<GeneralConfiguration[]>(this.BASE_URL + '/Configuration');
    }

    sendConfigurations(configurations: GeneralConfiguration[]): Observable<void> {
        return this.http.post<void>(this.BASE_URL + '/Configuration', configurations);
    }
}
