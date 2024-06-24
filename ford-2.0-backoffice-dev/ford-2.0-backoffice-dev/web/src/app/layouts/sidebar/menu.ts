import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'menu.global',
        isTitle: true,
    },
    {
        id: 2,
        label: 'menu.users',
        link: '/user-list',
    },
    {
        id: 3,
        label: 'menu.events',
        link: '/event-list' 
    },
    {
        id: 4,
        label: 'menu.subevents',
        link: '/subevent-list' 
    },
    {
        id: 5,
        label: 'menu.campaign-searches',
        link: '/campaign-searches-list' 
    },
    {
        id: 6,
        label: 'menu.vehicles',
        link: '/vehicle-list' 
    },
    {
        id: 7,
        label: 'menu.dealerships',
        link: '/dealership-list' 
    },
    //{
    //    id: 7,
    //    label: 'menu.forms',
    //    link: '/form-list' 
    //},
   //{
   //    id: 8,
   //    label: 'menu.terms-and-conditions',
   //    link: '/terms-and-conditions' 
   //},
    {
        id: 8,
        label: 'menu.campaigns',
        link: '/campaign-list' 
    },
    {
        id: 9,
        label: 'menu.general-configuration',
        link: '/general-configuration' 
    },
    {
        id: 10,
        label: 'menu.devices',
        link: '/device-list' 
    }
];

export const READONLYMENU: MenuItem[] = [
    {
        id: 1,
        label: 'menu.global',
        isTitle: true,
    },
    {
        id: 2,
        label: 'menu.events',
        link: '/event-list' 
    },
    {
        id: 3,
        label: 'menu.subevents',
        link: '/subevent-list' 
    },
    {
        id: 4,
        label: 'menu.vehicles',
        link: '/vehicle-list' 
    },
    {
        id: 5,
        label: 'menu.campaigns',
        link: '/campaign-list' 
    },
    {
        id: 6,
        label: 'menu.dealerships',
        link: '/dealership-list' 
    },
    {
        id: 7,
        label: 'menu.devices',
        link: '/device-list' 
    }
];

