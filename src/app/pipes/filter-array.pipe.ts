import { Pipe, PipeTransform } from '@angular/core';

// This pipe filters null, undefined values and empty strings from an array
@Pipe({
  name: 'filterArray',
  standalone: true,
})
export class FilterArrayPipe implements PipeTransform {
  transform(arr: Array<any>): Array<any> {
    if (!Array.isArray(arr)) {
      return [];
    }

    return arr.filter((v) => v !== undefined && v !== null && v !== '');
  }
}
