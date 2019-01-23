const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombre_archivo',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });
    if ((values.archivo && values.archivo.length === 0) | (!values.archivo)) {
        errors['archivo'] = 'Requerido'
    }
    if (values.archivo && values.archivo[0]) {
        const megas_archivo = values.archivo[0].size / 1000000;
        const tamano_maximo_archivo = 10;
        if (megas_archivo > tamano_maximo_archivo) {
            errors['archivo'] = `El tamaño del archivo (${megas_archivo.toFixed(2)} MB) supera al permitido (${tamano_maximo_archivo} MB)`
        }
    }
    return errors;
};

export default validate;