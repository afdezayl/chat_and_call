import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryLowercase',
})
export class CountryLowercasePipe implements PipeTransform {
  transform(value: string): string {
    const segments = value.split('-');
    let result = value;
    if (segments.length > 1){
      result = segments[1];
    }

    return result.toLowerCase();
  }
}
