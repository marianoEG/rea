import { Component, OnInit, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { fromEvent } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {

  element;
  cookieValue;
  flagvalue;
  countryName;
  valueset;
  @ViewChild('inputSearch') inputSearch: ElementRef;
  textSearch: string;
  hideSearcher: boolean;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    private authService: AuthService,
    public translate: TranslateService,
    public _cookiesService: CookieService,
    private localStorageService: LocalStorageService,
    private navigationService: NavigationService,
    private sharedService: SharedService) {
    this.textSearch = '';

    this.hideSearcher = this._hideSearcher();
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.hideSearcher = this._hideSearcher();
      }
    });
  }

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    this.openMobileMenu = false;
    this.element = document.documentElement;
  }

  ngAfterViewInit() {
    fromEvent(this.inputSearch.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.sharedService.emitSearchTextChange(this.textSearch);
      });
  }

  private _hideSearcher(): boolean {
    const currentUrl = location.hash.toLowerCase();
    return currentUrl.includes('subevent-list')
      || currentUrl.includes('guest-list')
      || !currentUrl.toLowerCase().includes('list');
  }

  nameToShow(): string {
    return this.localStorageService.getCompleteUserName();
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    this.localStorageService.clearAll();
    this.navigationService.toLogin();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}
