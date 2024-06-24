import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedList } from '../models/paged-list.model';
import { VehicleAccessory } from '../models/vehicle-accessory.model';
import { Version } from '../models/version.model';

@Injectable({
    providedIn: 'root'
})
export class VehicleAccessoryService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getVehicleAccessories(vehicleId:number, searchText?: string, pageNumber?: number, pageSize?: number): Observable<PagedList<VehicleAccessory>> {
        let queries = new HttpParams();
        
        queries = queries.append('vehicleId', vehicleId);
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());

        return this.http.get<PagedList<VehicleAccessory>>(this.BASE_URL + '/VehicleAccessory/list', {
            params: queries
        });
    }

    getVehicleAccessoryById(vehicleId: number, vehicleAccesoryId: number): Observable<VehicleAccessory> {
        return this.http.get<VehicleAccessory>(this.BASE_URL + `/VehicleAccessory/${vehicleId}/${vehicleAccesoryId}`);
    }

    createVehicleAccessory(vehicleAccessory: VehicleAccessory): Observable<VehicleAccessory> {
        return this.http.post<VehicleAccessory>(this.BASE_URL + '/VehicleAccessory', vehicleAccessory);
    }

    editVehicleAccessory(vehicleAccessory: VehicleAccessory): Observable<VehicleAccessory> {
        return this.http.put<VehicleAccessory>(this.BASE_URL + '/VehicleAccessory', vehicleAccessory);
    }

    deleteVehicleAccessory(vehicleId: number, vehicleAccesoryId: number): Observable<void> {
        return this.http.delete<void>(this.BASE_URL + `/VehicleAccessory/${vehicleId}/${vehicleAccesoryId}`);
    }
}