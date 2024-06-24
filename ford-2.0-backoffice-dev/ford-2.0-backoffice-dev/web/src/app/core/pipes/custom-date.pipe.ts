import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'customDate' })
export class CustomDatePipe implements PipeTransform {

    constructor(private datePipe: DatePipe) { }

    transform(value: string | Date | number, format?: string): string {
        if (!value)
            return '';

        // me aseguro que la fecha ISO tenga los milisegundos y la Z al final.
        // sin esto, no se puede transformar la hora local
        if (typeof value === 'string') {
            if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}/.test(value)) // '2011-10-05T14:48:00.000'
                value += 'Z';
            else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{2}/.test(value)) // '2011-10-05T14:48:00.00'
                value += '0Z';
            else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{1}/.test(value)) // '2011-10-05T14:48:00.0'
                value += '00Z';
            else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) // '2011-10-05T14:48:00'
                value += '.000Z';
        }

        return this.datePipe.transform(value, format);
    }

}