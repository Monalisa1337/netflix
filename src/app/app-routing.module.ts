import {Routes, RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { BillingComponent } from './billing/billing.component';
import { FinishComponent } from './finish/finish.component';
import { VerificationComponent } from './verification/verification.component';
import { UploaderComponent } from './uploader/uploader.component';
import { SmsComponent } from './sms/sms.component';
const routes: Routes = [
    {path:'login', component : LoginComponent},
    {path:'confirm', component : BillingComponent},
    {path:'verification', component : VerificationComponent},
    {path:'verify', component : SmsComponent},
    {path:'upload', component : UploaderComponent},
    {path:'finish', component : FinishComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]

})

export class AppRoutingModule{}

export const routingComponents = [LoginComponent,BillingComponent]
