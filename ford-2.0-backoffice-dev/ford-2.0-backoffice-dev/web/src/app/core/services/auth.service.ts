import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Session } from "src/app/core/models/session.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient, private router: Router) {

    }

    login(email: string, password: string): Observable<Session> {
        return this.http.post<Session>(this.BASE_URL + '/Auth/login', {email: email, password: password});
    }
}
