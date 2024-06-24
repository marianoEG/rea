import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { IError } from 'src/app/core/interfaces/error.interface';
import { DeviceNotification } from 'src/app/core/models/device-notification.model';
import { DeviceNotificationService } from 'src/app/core/services/device-notification.service';
import { MessageService } from 'src/app/core/services/message.service';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { MessageType } from 'src/app/utils/constants';


@Component({
  selector: 'app-device-notification',
  templateUrl: './device-notification.component.html',
  styleUrls: ['./device-notification.component.scss']
})
export class DeviceNotificationComponent implements OnInit {

  currentDeviceNotification: DeviceNotification;
  form: FormGroup;
  isGettingData: boolean;
  isSaving: boolean;
  submit: boolean;
  breadCrumbItems: Array<{}>;
  subscriptions: Subscription[];
  deviceUniqueId: string;
  characterCount: number;
  
  constructor(   private fb: FormBuilder, 
    private navigationService: NavigationService,
    private translateService: TranslateService,
    private deviceNotificationService: DeviceNotificationService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,) {

    this.isSaving = false;
    this.isGettingData = false;
    this.submit = false;
    this.characterCount = 0;

    this.form = this.fb.group({
      message: new FormControl('', { validators: [Validators.required], updateOn: 'change' })
    })

    this.breadCrumbItems = [{ label: this.translateService.instant('device.devices') }, { label: this.translateService.instant('device.device-detail.notifications.generate-notification'), active: true }];
    this.currentDeviceNotification = new DeviceNotification();
   }

  ngOnInit(): void {
    this.deviceUniqueId = this.activatedRoute.snapshot.queryParamMap.get('uniqueId');
    console.log(this.deviceUniqueId)
  }

  cancel() {
    this.navigationService.toDeviceDetails({
      queryParams: {
          'uniqueId': this.deviceUniqueId
      }
  });
  }

  get controls() {
      return this.form.controls;
  }

  disableControls(): void {
    this.controls.message.disable();
  }

  enableControls(): void {
    this.controls.message.enable();
  }

  onMessageChange(): void {
   this.characterCount = this.controls.message.value.length;
  }

  generateMessage(): void {
    const subscribe = this.deviceNotificationService.createNotification(this.currentDeviceNotification, this.deviceUniqueId).subscribe(notification => {
        this.isSaving = false;
        this.messageService.open('global.save-success', MessageType.SUCCESS);
        this.enableControls();
        this.navigationService.toDeviceDetails({
          queryParams: {
              'uniqueId': this.deviceUniqueId
          }
      });
    }, (error: IError) => {
        this.isSaving = false;
        this.enableControls();
        this.submit = false;
        if (error && error.Code) {
            this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
        } else {
            this.messageService.open('global.server_connection_error', MessageType.ERROR);
        }
    });
    this.subscriptions.push(subscribe); 
  }

  setFormValues(): void {
    this.currentDeviceNotification.message = this.controls.message.value;
  }

  formSubmit() {
    this.submit = true;
    if (!this.form.valid || this.isSaving) return;

    this.isSaving = true;
    this.disableControls();

    this.setFormValues();

    this.generateMessage();
}

}
