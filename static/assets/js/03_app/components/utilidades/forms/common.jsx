import {formatMoney} from 'accounting';

export const REGEX_SOLO_NUMEROS = /^-{0,1}\d*\.{0,1}\d+$/;

export const pesosColombianos = (plata) => formatMoney(Number(plata), "$", 0, ".", ",");

export const upper = value => value && value.toUpperCase();
export const lower = value => value && value.toLowerCase();