import {REGEX_SOLO_NUMEROS_DINERO} from "../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre',
        'nomenclatura',
        'moneda',
        'margen_deseado'
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    if (values['nomenclatura'] && values['nomenclatura'].length > 3) {
        errors['nomenclatura'] = 'Debe de tener menos de 3 caracteres'
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