import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CampaignService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getCampaigns(): Observable<string[]> {
        return this.http.get<string[]>(this.BASE_URL + '/Campaign/list');
    }
    
    deleteCampaign(url: string): Observable<void> {
        let fileName =  url.split('campaigns/')[1]
        return this.http.delete<void>(this.BASE_URL + '/Campaign/' + fileName);
    }
}