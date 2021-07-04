import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  public bookingData: any;
  public dataTransfer: any;
  public allReviews: any;
  public userDetails: any;
  public userData = new BehaviorSubject({});

  constructor() { }
}
