import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedList } from '../models/paged-list.model';
import { DeviceNotification } from '../models/device-notification.model';

@Injectable({
    providedIn: 'root'
})
export class DeviceNotificationService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getNotifications(searchText?: string, pageNumber?: number, pageSize?: number, uniqueId?: string): Observable<PagedList<DeviceNotification>> {
        let queries = new HttpParams();
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());

        return this.http.get<PagedList<DeviceNotification>>(this.BASE_URL + `/Notification/list/${uniqueId}`, {
            params: queries
        });
    }
    
    getNotificationById(notificationId: number): Observable<DeviceNotification> {
        return this.http.get<DeviceNotification>(this.BASE_URL + `/Notification/${notificationId}`);
    }

    createNotification(notification: DeviceNotification, deviceUniqueId: string): Observable<DeviceNotification> {
        let body = {
            message : notification.message,
            deviceUniqueId: deviceUniqueId
        }
        return this.http.post<DeviceNotification>(this.BASE_URL + '/Notification', body);
    }

    editNotification(notification: DeviceNotification): Observable<DeviceNotification> {
        return this.http.put<DeviceNotification>(this.BASE_URL + '/Notification', notification);
    }

    deleteNotification(notificationId: number): Observable<void> {
        return this.http.delete<void>(this.BASE_URL + `/Notification/${notificationId}`);
    }
}