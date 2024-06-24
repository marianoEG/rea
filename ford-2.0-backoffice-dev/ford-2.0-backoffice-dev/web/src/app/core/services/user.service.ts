import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Session } from '../models/session.model';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { PagedList } from '../models/paged-list.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    
    getUsers(searchText?: string, pageNumber?: number, pageSize?: number): Observable<PagedList<User>> {
        let queries = new HttpParams();
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());

        return this.http.get<PagedList<User>>(this.BASE_URL + '/User/list', {
            params: queries
        });
    }

    getUserById(userId: string): Observable<User> {
        return this.http.get<User>(this.BASE_URL + `/User/${userId}`);
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.BASE_URL + '/User', user);
    }

    editUser(user: User): Observable<User> {
        return this.http.put<User>(this.BASE_URL + '/User', user);
    }

    deleteUser(userId: string): Observable<void> {
        return this.http.delete<void>(this.BASE_URL + `/User/${userId}`);
    }

    changePass(email: string, newPass:string) : Observable<void> {
        let data = {
            email: email,
            password: newPass
        }
        return this.http.post<void>(this.BASE_URL + `/User/change-password`, data);
    }

}
