import {REGEX_SOLO_NUMEROS} from "../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'ano',
        'trimestre',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const jusNumbersFields = [
        'ano',
        'trimestre',
    ];
    jusNumbersFields.map(field => {
        if (values[field] && !REGEX_SOLO_NUMEROS.test(values[field])) {
            errors[field] = 'Debe ser un número'
        }
    });

    if (values.trimestre && values.trimestre < 1 || values.trimestre > 4) {
        errors['trimestre'] = 'Debe ser un número del 1 al 4'
    }

    if (values.ano && values.ano.length !== 4) {
        errors['ano'] = 'Debe ser un número de 4 dígitos'
    }

    return errors;
};

export default validate;