import { Component , OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { LocalStorageService } from './core/services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private ngxPermissionsService: NgxPermissionsService
  ) {
    translateService.addLangs(['es']);
    translateService.setDefaultLang('es');
  }

  ngOnInit() {
    if (this.localStorageService.getSession() && this.localStorageService.getSession().profile)
      this.ngxPermissionsService.loadPermissions([this.localStorageService.getSession().profile]);
  }
}
