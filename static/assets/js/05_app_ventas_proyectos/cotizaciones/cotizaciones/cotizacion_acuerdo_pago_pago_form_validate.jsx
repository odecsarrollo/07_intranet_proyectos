const validate = values => {
    const errors = {};
    const requiredFields = [
        'fecha',
        'valor',
        'comprobante_pago',
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