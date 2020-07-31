const validate = values => {
    const errors = {};

    const requiredFields = [
        'orden_compra_fecha',
        'valor_orden_compra',
        'orden_compra_nro',
        'orden_compra_archivo',
    ];
    requiredFields.map(field => {
        const es_archivo = values[field] instanceof FileList;
        if (!values[field] || (es_archivo && values[field].length <= 0)) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;