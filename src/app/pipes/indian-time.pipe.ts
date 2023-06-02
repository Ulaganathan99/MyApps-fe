import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianTime'
})
export class IndianTimePipe implements PipeTransform {

  transform(timestamp: string): string {
    const date = new Date(timestamp);
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: 'numeric' as const,
      minute: 'numeric' as const,
    };
    return date.toLocaleString('en-IN', options);
  }
}
