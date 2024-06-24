import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewsletterForm } from '../models/newsletter-form.model';
import { PagedList } from '../models/paged-list.model';
import { QuoteForm } from '../models/quote-form.model';
import { TestDriveForm } from '../models/test-drive.model';

@Injectable({
    providedIn: 'root'
})
export class FormService {
 
    private BASE_URL = environment.api.url;

    constructor(private http: HttpClient) { }

    getQuoteForms(searchText?: string, pageNumber?: number, pageSize?: number): Observable<PagedList<QuoteForm>> {
        let queries = new HttpParams();
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());

        return this.http.get<PagedList<QuoteForm>>(this.BASE_URL + '/Form/quote/list', {
            params: queries
        });
    }

    getQuoteFormById(quoteFormId: number): Observable<QuoteForm> {
        return this.http.get<QuoteForm>(this.BASE_URL + `/Form/quote/${quoteFormId}`);
    }

    getTestDriveForms(searchText?: string, pageNumber?: number, pageSize?: number): Observable<PagedList<TestDriveForm>> {
        let queries = new HttpParams();
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());

        return this.http.get<PagedList<TestDriveForm>>(this.BASE_URL + '/Form/testDrive/list', {
            params: queries
        });
    }

    getTestDriveFormById(testDriveFormId: number): Observable<TestDriveForm> {
        return this.http.get<TestDriveForm>(this.BASE_URL + `/Form/testDrive/${testDriveFormId}`);
    }

    getNewsletterForms(searchText?: string, pageNumber?: number, pageSize?: number): Observable<PagedList<NewsletterForm>> {
        let queries = new HttpParams();
        if (searchText) queries = queries.append('searchText', searchText);
        if (pageNumber) queries = queries.append('pageNumber', pageNumber.toString());
        if (pageSize) queries = queries.append('pageSize', pageSize.toString());

        return this.http.get<PagedList<NewsletterForm>>(this.BASE_URL + '/Form/newsletter/list', {
            params: queries
        });
    }

    getNewsletterFormById(newsletterFormId: number): Observable<NewsletterForm> {
        return this.http.get<NewsletterForm>(this.BASE_URL + `/Form/newsletter/${newsletterFormId}`);
    }

}