const validate = values => {
    const errors = {};

    const requiredFields = [
        'cliente_que_permanece_id',
        'cliente_a_eliminar_id',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;