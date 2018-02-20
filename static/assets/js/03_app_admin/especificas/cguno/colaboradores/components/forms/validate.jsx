const validate = values => {
    const errors = {};
    if (!values.nombres) {
        errors.nombres = 'Requerido';
    }
    if (!values.apellidos) {
        errors.apellidos = 'Requerido';
    }
    if (!values.cedula) {
        errors.cedula = 'Requerido';
    }

    return errors;
};

export default validate;