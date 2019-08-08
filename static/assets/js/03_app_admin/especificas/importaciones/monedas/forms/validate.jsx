import {REGEX_SOLO_NUMEROS_DINERO} from '../../../../../00_utilities/common';

const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'cambio'
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    if (values['cambio'] && values['cambio'] <= 0) {
        errors['cambio'] = 'Debe ser un número mayor que 0'
    }

    const soloNumerosFields = [
        'cambio'
    ];
    soloNumerosFields.map(field => {
        if (values[field] && !REGEX_SOLO_NUMEROS_DINERO.test(values[field])) {
            errors[field] = 'Debe ser sólo números'
        }
    });

    return errors;
};

export default validate;