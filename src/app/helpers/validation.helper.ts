// src/app/helpers/validation.helper.ts

export function passValidator(password: string): boolean {
/*
Explicación de la Expresión Regular
    ^(?=(.*[A-Z])): Asegura que haya al menos una letra mayúscula.
    (?=(.*[0-9]){4,}): Asegura que haya al menos 4 dígitos.
    (?=(.*[a-zA-Z]){3,}): Asegura que haya al menos 3 caracteres (letras).
    .{8,}$: Asegura que la longitud total del password sea de al menos 8 caracteres.
*/

    // Expresión regular para validar el password
    const regex = /^(?=(.*[A-Z]))(?=(.*[0-9]){4,})(?=(.*[a-zA-Z]){3,}).{8,}$/;

    // Retorna true si el password cumple con los criterios, de lo contrario false
    return regex.test(password);
}
