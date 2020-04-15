import {REGEX_SOLO_NUMEROS} from "../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'proyecto',
        'literal',
        'horas',
        'minutos',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });


    const justNumberFields = [
        'horas',
        'minutos',
    ];
    justNumberFields.map(field => {
        if (values[field] && !REGEX_SOLO_NUMEROS.test(values[field])) {
            errors[field] = 'Debe ser un número'
        }
    });

    if (values.minutos && values.minutos > 59) {
        errors.minutos = 'Los minutos deben ser menores a 60, de ser 60 sería una hora'
    }

    if (values.horas && values.horas > 23) {
        errors.horas = 'No se pueden exceder las 19 horas en un registro de horas de trabajo'
    }

    return errors;
};

export default validate;