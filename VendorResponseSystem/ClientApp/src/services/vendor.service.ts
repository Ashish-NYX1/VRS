import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { POLineItemModel } from '../models/po-line-item-model';
import { VendorBuyerModel } from '../models/vendor-buyer-model';
import { BuyerVendorConfiguration } from '../models/buyer-vendor-configuration';
import { Work } from '../models/work';
import { ApiSettings } from '../models/api-Settings';
import { EmailNotificationModel } from '../models/email-notification-model';
import { VendorResponseModel } from '../models/vendor-response-model';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  url: string;
  constructor(private http: HttpClient) {
    this.url = ApiSettings.Url;
  }  

  getPOLineItems(): Observable<POLineItemModel[]>{
    return this.http.get<POLineItemModel[]>(this.url + 'polineitems?userName=' + sessionStorage.getItem('username'));
  }

  getPOLineItemsByVendorBuyer(vendCode: string, buyerCode: string): Observable<POLineItemModel[]> {
    return this.http.get<POLineItemModel[]>(this.url + 'polineitems/POLineItemsByVendorBuyer/' + vendCode + '/' + buyerCode);
  }

  getVendors(): Observable<VendorBuyerModel[]> {
    return this.http.get<VendorBuyerModel[]>(this.url + 'vendor?userName=' + sessionStorage.getItem('username'));
  }

  getVendorBuyerConfiguration(buyercode: string, vendcode: string): Observable<BuyerVendorConfiguration> {
    return this.http.get<BuyerVendorConfiguration>(this.url + 'Vendor/VendorBuyerConfiguration/' + buyercode.trim() + '/' + vendcode.trim());
  }

  saveVendorBuyerConfiguration(config: BuyerVendorConfiguration): Observable<boolean> {
    return this.http.post<boolean>(this.url + 'Vendor/SaveVendorBuyerConfiguration', config);
  }

  updateVendorEmail(vendcode: string, vendemail: string): Observable<boolean> {
    return this.http.post<boolean>(this.url + 'Vendor/UpdateVendorEmail/' + vendcode + '/' + vendemail, {});
  }

  getWorkResponses(): Observable<Work[]> {
    return this.http.get<Work[]>(this.url + 'workresponse');
  }
  getrequestResponseCount(): Observable<any> {
    return this.http.get<any>(this.url + 'workresponse/requestresponsecount');
  }

  sendNotification(notification: EmailNotificationModel): Observable<any> {
    return this.http.post<any>(this.url + 'Vendor/SendVendorNotification', notification);
  }

  getVendorResponseByRequestId(requestresponseid: number): Observable<VendorResponseModel> {
    return this.http.get<VendorResponseModel>(this.url + 'Vendor/VendorResponse/' + requestresponseid);
  }

  saveVendorResponse(response: VendorResponseModel): Observable<any> {
    return this.http.post<any>(this.url + 'Vendor/SaveVendorResponse', response);
  }
}
