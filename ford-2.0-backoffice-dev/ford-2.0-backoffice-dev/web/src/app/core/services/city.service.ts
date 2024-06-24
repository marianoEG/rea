import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { City } from '../models/city.model';
import { PagedList } from '../models/paged-list.model';

@Injectable({
    providedIn: 'root'
})
export class CityService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getCities(provinceId: number): Observable<City[]> {
        let queries = new HttpParams();
        queries = queries.append('provinceId', provinceId.toString());

        return this.http.get<City[]>(this.BASE_URL + '/City/list', {
            params: queries
        });
    }
}