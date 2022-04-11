import { HostListener } from '@angular/core';
import { Component } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';

import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  public innerWidth: any;
  public mobile: boolean = false;
  public mobile2: boolean = false;

  constructor(public translate: TranslateService, private recaptchaV3Service: ReCaptchaV3Service){
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('de');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|de/) ? browserLang: 'de');
    //this.executeImportantAction();
  }
  title = 'NetfIix';
  ngOnInit(){
    this.innerWidth = window.innerWidth;

  if(this.innerWidth < 353){
    this.mobile2 = true;
    }else{
      this.mobile2 = false;
    }
  if(this.innerWidth < 490){
  this.mobile = true;
  }else{
    this.mobile = false;
  }
  }
  @HostListener('window:resize', ['$event'])
onResize(event) {
  this.innerWidth = window.innerWidth;

  if(this.innerWidth < 353){
    this.mobile2 = true;
    }else{
      this.mobile2 = false;
    }
  if(this.innerWidth < 490){
  this.mobile = true;
  }else{
    this.mobile = false;
  }
}


public executeImportantAction(): void {
  this.recaptchaV3Service.execute('importantAction')
    .subscribe((token) => this.handleToken(token));
}
handleToken(token: string): void {
  throw new Error('Method not implemented.');
}
  
}
