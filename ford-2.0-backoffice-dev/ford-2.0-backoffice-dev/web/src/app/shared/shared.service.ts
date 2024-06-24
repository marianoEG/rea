import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

    private emitChangeSearchText = new Subject<string>();
    public $searchTextEmitted = this.emitChangeSearchText.asObservable();
    emitSearchTextChange(searchText: string) {
      this.emitChangeSearchText.next(searchText);
    }

    private emitSuccessMessage = new Subject<string>();
    public $successMessageEmitted = this.emitSuccessMessage.asObservable();
    emitMessageSuccess(messageKey: string) {
      this.emitSuccessMessage.next(messageKey);
    }

}