import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(value: any): any {
    if (value && typeof value === 'string' && value.length === 10) {
      const firstTwoDigits = value.slice(0, 2);
      const nextFourDigits = value.slice(2, 6);
      const lastFourDigits = value.slice(6, 10);

      return `+91 ${firstTwoDigits} ${nextFourDigits} ${lastFourDigits}`;
    }
    
    return value;
  }

}
