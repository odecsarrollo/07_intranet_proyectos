import {formatMoney, formatNumber} from 'accounting';
import moment from 'moment-timezone';
import momentLocaliser from "react-widgets-moment";

moment.tz.setDefault("America/Bogota");
moment.locale('es');
momentLocaliser(moment);

export const REGEX_SOLO_NUMEROS_DINERO = /^-{0,1}\d*\.{0,1}\d+$/;
export const REGEX_SOLO_NUMEROS = /^-{0,1}\d+$/;
export const REGEX_SOLO_LETRAS = /^[a-zA-Z]+$/;
export const REGEX_CORREO_ELECTRONICO = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const formatoDinero = (plata, simbolo, precision) => formatMoney(Number(plata), simbolo, precision, ".", ",");
export const pesosColombianos = (plata) => formatMoney(Number(plata), "$", 0, ".", ",");
export const formatoMoneda = (valor, simbolo, decimales, nombre_moneda = null) => `${formatMoney(Number(valor), simbolo, decimales, ".", ",")}${nombre_moneda ? ` ${nombre_moneda}` : ''}`;
export const numeroFormato = (valor, decimales = 4) => formatNumber(Number(valor), decimales, ".", ",");
export const fechaFormatoUno = (fecha) => moment.tz(fecha, "America/Bogota").format('MMMM D [de] YYYY');
export const fechaHoraFormatoUnoSinTZ = (fecha) => {
    const fecha_date = new Date(fecha);
    return `${fecha_date.getDate()}/${fecha_date.getMonth()}/${fecha_date.getFullYear()} ${fecha_date.getHours()}:${fecha_date.getMinutes()}`
};
export const fechaFormatoDos = (fecha) => moment.tz(fecha, "America/Bogota").format('DD/MM/YYYY');
export const fechaHoraFormatoUno = (fecha) => {
    const dateTime = moment.tz(fecha, "America/Bogota");
    return `${fechaFormatoUno(fecha)} ${dateTime.hours()}:${dateTime.minutes()}`;
};
export const horaFormatoUno = (fecha) => {
    const dateTime = moment.tz(fecha, "America/Bogota");
    return `${dateTime.hours()}:${dateTime.minutes()}`;
};

export const fechaToYMD = (fecha) => fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();

export const formatBytes = (bytes, decimals = 3) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1000,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const upper = value => value && value.toUpperCase();
export const lower = value => value && value.toLowerCase();


export const tengoPermisoDos = (mis_permisos, permisos, tipo = 'and') => {
    let permisos_a_validar_array = permisos;
    if (!Array.isArray(permisos)) {
        permisos_a_validar_array = [permisos]
    }
    const mis_permisos_array = _.map(mis_permisos, permiso => {
        return permiso
    });
    const validaciones_array = permisos_a_validar_array.map(permiso => {
        return mis_permisos_array.includes(permiso)
    });
    if (tipo === "and") {
        return !validaciones_array.includes(false);
    } else if (tipo === "or") {
        return validaciones_array.includes(true);
    }
};

export const permisosAdapterDos = (mis_permisos, permisos_view) => {
    return _.mapValues(permisos_view, p => tengoPermisoDos(mis_permisos, p));
};