import {REGEX_SOLO_NUMEROS, REGEX_SOLO_NUMEROS_DINERO} from "../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'colaborador',
        'proyecto',
        'literal',
        'centro_costo',
        'valor',
        'minutos',
        'horas',
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

    if (!REGEX_SOLO_NUMEROS_DINERO.test(values.valor)) {
        errors.valor = 'Debe ser un número'
    }
    return errors;
};

export default validate;