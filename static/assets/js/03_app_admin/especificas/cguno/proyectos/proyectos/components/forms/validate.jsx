import {REGEX_SOLO_NUMEROS_DINERO} from "../../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};


    const requiredFields = [
        'id_proyecto',
        'valor_cliente',
        'costo_presupuestado',
        'nombre',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const justMoneyFields = [
        'valor_cliente',
        'costo_presupuestado',
    ];
    justMoneyFields.map(field => {
        if (values[field] && !REGEX_SOLO_NUMEROS_DINERO.test(values[field])) {
            errors[field] = 'Debe ser un número'
        }
    });


    if (values.valor_cliente && values.valor_cliente < 0) {
        errors.valor_cliente = 'El precio debe de ser positivo';
    }

    if (values.costo_presupuestado && values.costo_presupuestado < 0) {
        errors.costo_presupuestado = 'El costo presupuestado debe de ser positivo';
    }


    return errors;
};

export default validate;