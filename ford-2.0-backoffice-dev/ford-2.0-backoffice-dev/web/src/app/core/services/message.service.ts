import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import Swal from "sweetalert2";

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor( private translateService: TranslateService) {

    }

    open(messageKey: string, messageType: string): void {
        Swal.fire({
            position: 'top-end',
            title: this.translateService.instant(messageKey),
            showConfirmButton: false,
            customClass: {
                container: 'message-container',
                popup: messageType,
                title: messageType
            },
            timer: 2000
        });
    }

}