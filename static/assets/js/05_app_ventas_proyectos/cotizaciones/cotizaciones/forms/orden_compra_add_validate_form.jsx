const validate = values => {
    const errors = {};

    const requiredFields = [
        'orden_compra_fecha',
        'valor_orden_compra',
        'orden_compra_nro',
        'orden_compra_archivo',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;