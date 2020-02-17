const validate = values => {
    const errors = {};

    const requiredFields = [
        'serie',
        'tipo',
        'material',
        'color',
        'largo',
        'ancho',
        'empujador_tipo',
        'empujador_alto',
        'empujador_ancho',
        'empujador_distanciado',
        'empujador_filas_entre_empujador',
        'empujador_filas_empujador',
        'empujador_identacion',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    return errors;
};

export default validate;