import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { ProgressInterceptor } from './Interceptor/progress-interceptor';
import { ProgressComponent } from './progress/progress.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { AgGridModule } from 'ag-grid-angular';
import { ViewRendererComponent } from './view-renderer/view-renderer.component';
import { NgChartsModule } from 'ng2-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { POLineItemListComponent } from './po-line-item-list/po-line-item-list.component';
import { VendorConfigurationComponent } from './vendor-configuration/vendor-configuration.component';
import { VendorConfigurationListComponent } from './vendor-configuration-list/vendor-configuration-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { POSelectionComponent } from './poselection/poselection.component';
import { SubmitVendorResponseComponent } from './submit-vendor-response/submit-vendor-response.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    ProgressComponent,
    ViewRendererComponent,
    POLineItemListComponent,
    VendorConfigurationComponent,
    VendorConfigurationListComponent,
    DashboardComponent,
    POSelectionComponent,
    SubmitVendorResponseComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,  
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatGridListModule,
    MatCardModule,
    AgGridModule,
    MatTableModule,
    MatSelectModule,  
    FormsModule,
    ReactiveFormsModule,
    MatLegacyChipsModule,
    FlexLayoutModule,
    NgChartsModule,
    MatRadioModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'POLineItems', component: POLineItemListComponent, canActivate: [AuthGuard] },
      { path: 'VendorList', component: VendorConfigurationListComponent, canActivate: [AuthGuard] },
      { path: 'Dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'VendorResponse/:requestresponseid', component: SubmitVendorResponseComponent }
    ]),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right', 
      preventDuplicates: true,
    })
  ],
  providers: [DatePipe,
    {
     provide: HTTP_INTERCEPTORS,
     useClass: ProgressInterceptor,
     multi: true,
   }],
  bootstrap: [AppComponent]
})
export class AppModule { }
