import { Injectable } from '@angular/core';
import { Session } from '../models/session.model';
import { Nullable } from '../../utils/constants';
import { Vehicle } from '../models/vehicle.model';
import { Guest } from '../models/guest.model';
import { Subevent } from '../models/subevent.model';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    private readonly BASE_KEY: string = "FORD_EVENTS_";
    private readonly SESSION: string = "SESSION";
    private readonly CURRENT_VEHICLE: string = "CURRENT_VEHICLE";
    private readonly CURRENT_SUBEVENT: string = "CURRENT_SUBEVENT";

    //#region Session
    public saveSession(session: Session): void {
        this.saveValue(this.BASE_KEY + this.SESSION, session);
    }

    public getSession(): Nullable<Session> {
        let session = this.getValue<Session>(this.BASE_KEY + this.SESSION);
        return session ? session as Session : null;
    }

    public getSessionToken(): Nullable<string> {
        return this.getSession()?.token;
    }

    public getUserId(): Nullable<string> {
        return this.getSession()?.userId;
    }

    public getCompleteUserName(): string {
        return this.getSession().firstname + ' ' + this.getSession().lastname;
    }

    public getUserProfile(): string {
        return this.getSession().profile;
    }

    //#endregion

    //#region Vehicle Version
    public saveVehicleData(vehicle: Vehicle): void {
        this.saveValue(this.BASE_KEY + this.CURRENT_VEHICLE, vehicle);
    }

    public getVehicle(): Nullable<Vehicle> {
        let vehicle = this.getValue<Vehicle>(this.BASE_KEY + this.CURRENT_VEHICLE);
        return vehicle ? vehicle as Vehicle : null;
    }
    //#endregion

    //#region Subevent 
    public saveSubEventData(subevent: Subevent): void {
        this.saveValue(this.BASE_KEY + this.CURRENT_SUBEVENT, subevent);
    }

    public getSubevent(): Nullable<Subevent> {
        let subevent = this.getValue<Subevent>(this.BASE_KEY + this.CURRENT_SUBEVENT);
        return subevent ? subevent as Subevent : null;
    }
    //#endregion

    //#region Private Methods
    private saveValue(key: string, value: any): void {
        if (!value) return;
        localStorage.setItem(key, JSON.stringify(value));
    }

    private getValue<T>(key: string): Nullable<T> {
        let item = localStorage.getItem(key);
        if (!item) return null;
        try {
            return JSON.parse(item) as T;
        } catch (error) {
            return null;
        }
    }
    //#endregion

    //#region Clear
    public clear(key: string): void {
        localStorage.removeItem(this.BASE_KEY + key);
    }

    public clearAll() {
        this.clear(this.SESSION);
    }
    //#endregion
}
