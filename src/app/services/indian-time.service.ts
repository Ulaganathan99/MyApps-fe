import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndianTimeService {

  constructor() { }
  transform(timestamp: string): string {
    const date = new Date(timestamp);
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: 'numeric' as const,
      minute: 'numeric' as const,
      second: 'numeric' as const
    };
    return date.toLocaleString('en-IN', options);
  }

}
