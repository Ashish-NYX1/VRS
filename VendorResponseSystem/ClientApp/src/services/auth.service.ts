import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiSettings } from '../models/api-Settings';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string;
  constructor(private http: HttpClient) {
    this.url = ApiSettings.Url;
  }

  login(username: string, password: string): Observable<any> {    
    return this.http.post(this.url +'auth/login', { username, password });
  }

  getUserNames(): Observable<any>{
    return this.http.get(this.url + 'auth/usernames');
  }

  getSubGroups(): Observable<any>{
    return this.http.get(this.url + 'auth/subgroups');
  }

  getUserImage(username: string): Observable<Blob> {
    return this.http.get(`${this.url}auth/EmpPhoto/${username}`, { responseType: 'blob' });
  }

}
