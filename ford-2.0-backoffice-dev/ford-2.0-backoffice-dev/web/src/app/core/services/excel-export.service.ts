import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import Swal from "sweetalert2";
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as ExcelProper from "exceljs";
import * as FileSaver from 'file-saver';
import { ExportObjectType } from "src/app/utils/constants";
import { Guest } from "../models/guest.model";

@Injectable({
    providedIn: 'root'
})
export class ExcelExportService {

    blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    constructor(private translateService: TranslateService) {

    }

    export(listToExport: any[], headersList: any[], objectType: ExportObjectType): void {

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("My Sheet");

        let columns = [];
        headersList.forEach(header => {
            columns.push({ header: header.value, key: header.key, width: 30 });
        });

        worksheet.columns = columns;

        listToExport.forEach((element) => {
            switch (objectType) {
                case ExportObjectType.DEALERSHIP:
                    worksheet.addRow([
                        element.id, element.name, element.code,
                        element.provinceId, element.cityId,
                        element.lat, element.long, element.streetNameAndNumber,
                        element.postalCode, element.phone1,
                        element.phone2, element.dealerCode
                    ]);
                    break
                case ExportObjectType.GUEST:
                    worksheet.addRow([
                        element.documentNumber,
                        element.firstname, element.lastname,
                        element.email, element.phoneNumber,
                        element.state ? this.translateService.instant('guest.guest-edition.' + element.state) : '-',
                        element.type ? this.translateService.instant('guest.guest-edition.' + element.type) : '-',
                        element.carLicencePlate,
                        this.translateService.instant(element.changedByQrscanner ? 'global.yes' : 'global.no'),
                        element.companionReference, element.zone,
                        element.observations1, element.observations2, element.observations3,
                        element.preferenceDate, element.preferenceHour, element.preferenceVehicle
                    ]);
                    break
                case ExportObjectType.CAMPAIGN_SEARCH:
                    worksheet.addRow([
                        element.eventName, element.searchText, element.searchDate, element.vin, element.cc,
                        element.pat, element.serv, element.servDate, element.manten, element.syncDate
                    ]);
                    break
            }

        });

        workbook.xlsx.writeBuffer().then((data: any) => {
            console.log("buffer");
            const blob = new Blob([data], {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            FileSaver.saveAs(blob, objectType.toLowerCase() + '_list');
        });
    }

}