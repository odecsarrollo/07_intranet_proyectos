import {REGEX_SOLO_NUMEROS} from "../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'ano',
        'mes',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const justNumbersFields = [
        'ano',
        'mes',
    ];
    justNumbersFields.map(field => {
        if (values[field] && !REGEX_SOLO_NUMEROS.test(values[field])) {
            errors[field] = 'Debe ser un número'
        }
    });

    if (values.mes && values.mes < 1 || values.mes > 12) {
        errors['mes'] = 'Debe ser un número del 1 al 12'
    }

    if (values.ano && values.ano.length !== 4) {
        errors['ano'] = 'Debe ser un número de 4 dígitos'
    }

    return errors;
};

export default validate;