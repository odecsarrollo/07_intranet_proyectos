import {formatMoney} from 'accounting';
import moment from 'moment-timezone';
import momentLocaliser from "react-widgets-moment";

moment.tz.setDefault("America/Bogota");
moment.locale('es');
momentLocaliser(moment);

export const REGEX_SOLO_NUMEROS_DINERO = /^-{0,1}\d*\.{0,1}\d+$/;
export const REGEX_SOLO_NUMEROS = /^-{0,1}\d+$/;

export const pesosColombianos = (plata) => formatMoney(Number(plata), "$", 0, ".", ",");
export const fechaFormatoUno = (fecha) => moment.tz(fecha, "America/Bogota").format('MMMM D [de] YYYY');

export const upper = value => value && value.toUpperCase();
export const lower = value => value && value.toLowerCase();