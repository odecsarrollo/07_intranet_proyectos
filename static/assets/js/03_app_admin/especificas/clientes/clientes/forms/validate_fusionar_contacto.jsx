const validate = values => {
    const errors = {};

    const requiredFields = [
        'contacto_que_permanece_id',
        'contacto_a_eliminar_id',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;