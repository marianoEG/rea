import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { PagedList } from '../models/paged-list.model';
import { environment } from 'src/environments/environment';
import { Device } from '../models/device.model';
import { map } from 'rxjs/internal/operators/map';

@Injectable({ providedIn: 'root' })
export class DeviceService {

    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }


    getDevices(pageNumber?: number, pageSize?: number): Observable<PagedList<Device>> {
        let queries = new HttpParams();
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());

        return this.http
            .get<PagedList<Device>>(this.BASE_URL + '/Device/list', {
                params: queries
            })
            .pipe(
                map((res: PagedList<Device>) => ({
                    ...res,
                    listOfEntities: res?.listOfEntities?.map<Device>(device => Object.assign(new Device(), device))
                }))
            );
    }

    getDeviceByUniqueId(uniqueId: string): Observable<Device> {
        return this.http
            .get<Device>(this.BASE_URL + `/Device/${uniqueId}`)
            .pipe(
                map((device: Device) => Object.assign(new Device(), device))
            );
    }

    deleteLogs(uniqueId: string): Observable<void> {
        return this.http.delete<void>(this.BASE_URL + `/Device/logs/${uniqueId}`);
    }

    deleteErrors(uniqueId: string): Observable<void> {
        return this.http.delete<void>(this.BASE_URL + `/Device/errors/${uniqueId}`);
    }

}
