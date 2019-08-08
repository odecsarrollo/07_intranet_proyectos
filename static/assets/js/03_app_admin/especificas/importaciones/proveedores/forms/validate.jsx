import {REGEX_SOLO_NUMEROS_DINERO} from '../../../../../00_utilities/common';

const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'moneda',
        'factor_importacion',
        'factor_importacion_aereo',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const soloNumerosFields = [
        'factor_importacion',
        'factor_importacion_aereo',
    ];
    soloNumerosFields.map(field => {
        if (values[field] && !REGEX_SOLO_NUMEROS_DINERO.test(values[field])) {
            errors[field] = 'Debe ser sólo números'
        }
    });

    const mayoresACeroFields = [
        'factor_importacion',
        'factor_importacion_aereo',
    ];
    mayoresACeroFields.map(field => {
        if (values[field] && values[field] <= 0) {
            errors[field] = 'Debe ser un número mayor que 0'
        }
    });

    return errors;
};

export default validate;