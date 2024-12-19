import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from 'src/models/user-model';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }
  private sharedDisplayNameSubject = new BehaviorSubject<string>('');
  sharedDisplayName$ = this.sharedDisplayNameSubject.asObservable();

  setSharedDisplayName (value: string){
    this.sharedDisplayNameSubject.next(value);
  }
}
