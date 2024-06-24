import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedList } from '../models/paged-list.model';
import { Province } from '../models/province.model';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    saveAndGetResourceUrl(data: File): Observable<string> {
        let formData = new FormData();
        formData.append('fileData', data);
        return this.http.post<string>(this.BASE_URL + '/Resource/upload-file', formData);
    }
}