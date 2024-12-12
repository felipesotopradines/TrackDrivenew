import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatClp'
})
export class FormatClpPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) return '';
    // Formatear el número con separador de miles como '.' y sin decimales
    const formattedValue = value.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return `$${formattedValue}`; // Agregar el signo '$'
  }
}
