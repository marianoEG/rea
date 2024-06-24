import { Nullable } from './constants';

export const capitalize = (text: Nullable<string>): string => {
    if (!text) return '';
    return text.trim().charAt(0).toUpperCase() + text.trim().slice(1).toLowerCase();
}

export const dateToSyncSaleForce = (date: Date): string => {
    if (!date) return '';
    const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    const month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    const year = date.getFullYear();
    const hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
    const minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    const second = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

    return `${day}/${month}/${year}, ${hour}:${minute}:${second}`;
}