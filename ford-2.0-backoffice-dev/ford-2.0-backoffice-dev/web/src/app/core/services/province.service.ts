import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedList } from '../models/paged-list.model';
import { Province } from '../models/province.model';

@Injectable({
    providedIn: 'root'
})
export class ProvinceService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getProvinces(): Observable<Province[]> {

        return this.http.get<Province[]>(this.BASE_URL + '/Province/list');
    }
}