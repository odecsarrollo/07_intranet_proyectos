import {REGEX_CORREO_ELECTRONICO} from "../../../../00_utilities/common";

const validate = values => {
    const errors = {};
    if (values.email_tres && !REGEX_CORREO_ELECTRONICO.test(values.email_tres)) {
        errors.email_tres = 'Correo Electrónico Inválido';
    }
    if (values.email_cuatro && !REGEX_CORREO_ELECTRONICO.test(values.email_cuatro)) {
        errors.email_cuatro = 'Correo Electrónico Inválido';
    }
    return errors;
};

export default validate;