import {REGEX_SOLO_NUMEROS_DINERO} from '../../../../../00_utilities/common';

const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'categoria',
        'proveedor',
        'margen_deseado',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    if (values['margen_deseado'] && values['margen_deseado'] <= 0) {
        errors['margen_deseado'] = 'Debe ser un número mayor que 0'
    }

    const soloNumerosFields = [
        'margen_deseado'
    ];
    soloNumerosFields.map(field => {
        if (values[field] && !REGEX_SOLO_NUMEROS_DINERO.test(values[field])) {
            errors[field] = 'Debe ser sólo números'
        }
    });

    return errors;
};

export default validate;