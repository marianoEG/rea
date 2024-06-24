import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
import { PagedList } from '../models/paged-list.model';
import { Version } from '../models/version.model';

@Injectable({
    providedIn: 'root'
})
export class VersionService {

    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getVersions(vehicleId: number, searchText?: string, pageNumber?: number, pageSize?: number): Observable<PagedList<Version>> {
        let queries = new HttpParams();

        queries = queries.append('vehicleId', vehicleId);
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());

        return this.http.get<PagedList<Version>>(this.BASE_URL + '/Version/list', {
            params: queries
        }).pipe(
            map(res => {
                res.listOfEntities = res?.listOfEntities?.map<Version>(version => {
                    version = Object.assign(new Version(), version);
                    version.isSelected = false;
                    version.newCurrency = version.currency;
                    version.newPrice = version.price;
                    version.isChangingPrice = false;
                    return version;
                });

                return res;
            })
        )
    }

    getVersionById(versionId: number): Observable<Version> {
        return this.http.get<Version>(this.BASE_URL + `/Version/${versionId}`);
    }

    createVersion(version: Version): Observable<Version> {
        return this.http.post<Version>(this.BASE_URL + '/Version', version);
    }

    editVersion(version: Version): Observable<Version> {
        return this.http.put<Version>(this.BASE_URL + '/Version', version);
    }

    deleteVersion(versionId: number): Observable<void> {
        return this.http.delete<void>(this.BASE_URL + `/Version/${versionId}`);
    }

    setVersionPreLaunch(versionId: number, preLaunch: boolean): Observable<void> {
        return this.http.post<void>(this.BASE_URL + `/Version/set-pre-launch/${versionId}`, { preLaunch });
    }

    changeVersionPrice(versionId: number, currency: string, price: number): Observable<void> {
        return this.http.post<void>(this.BASE_URL + `/Version/change-price/${versionId}`, { currency, price });
    }
}