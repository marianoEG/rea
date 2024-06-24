import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FeatureGroup } from '../models/feature-group.model';
import { PagedList } from '../models/paged-list.model';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getVehicles(searchText?: string, pageNumber?: number, pageSize?: number): Observable<PagedList<Vehicle>> {
        let queries = new HttpParams();
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());

        return this.http.get<PagedList<Vehicle>>(this.BASE_URL + '/Vehicle/list', {
            params: queries
        });
    }

    getVehicleById(vehicleId: number): Observable<Vehicle> {
        return this.http.get<Vehicle>(this.BASE_URL + `/Vehicle/${vehicleId}`);
    }
    getVehicleTypes(): Observable<string[]> {
        return this.http.get<string[]>(this.BASE_URL + '/Vehicle/types');
    }

    createVehicle(vehicle: Vehicle): Observable<Vehicle> {
        return this.http.post<Vehicle>(this.BASE_URL + '/Vehicle', vehicle);
    }

    editVehicle(vehicle: Vehicle): Observable<Vehicle> {
        return this.http.put<Vehicle>(this.BASE_URL + '/Vehicle', vehicle);
    }

    deleteVehicle(vehicleId: number): Observable<void> {
        return this.http.delete<void>(this.BASE_URL + `/Vehicle/${vehicleId}`);
    }

    getVehicleFeatureGroups(vehicleId:number, searchText?: string, pageNumber?: number, pageSize?: number): Observable<PagedList<FeatureGroup>> {
        let queries = new HttpParams();
        queries = queries.append('vehicleId', vehicleId);
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());

        return this.http.get<PagedList<FeatureGroup>>(this.BASE_URL + '/Vehicle/featureGroups', {
            params: queries
        });
    }
}
