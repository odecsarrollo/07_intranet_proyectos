import {REGEX_CORREO_ELECTRONICO} from "../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombres',
        'apellidos',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.correo_electronico && !REGEX_CORREO_ELECTRONICO.test(values.correo_electronico)) {
        errors.correo_electronico = 'Correo Electrónico Inválido';
    }

    if (values.correo_electronico_2 && !REGEX_CORREO_ELECTRONICO.test(values.correo_electronico_2)) {
        errors.correo_electronico_2 = 'Correo Electrónico Inválido';
    }
    return errors;
};

export default validate;