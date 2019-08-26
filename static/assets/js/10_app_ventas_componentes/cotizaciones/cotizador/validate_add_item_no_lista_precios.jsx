import {REGEX_SOLO_NUMEROS_DINERO} from '../../../00_utilities/common';

const validate = values => {
    const errors = {};

    const requiredFields = [
        'precio_unitario',
        'item_descripcion',
        'item_referencia',
        'item_unidad_medida'
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });


    const justNumbersFields = [
        'precio_unitario',
    ];
    justNumbersFields.map(field => {
        if (values[field] && !REGEX_SOLO_NUMEROS_DINERO.test(values[field])) {
            errors[field] = 'Debe ser un valor monetario'
        }
    });
    return errors;
};

export default validate;