import {REGEX_SOLO_NUMEROS_DINERO} from "../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'valor_cliente',
        'descripcion',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const justMoneyFields = [
        'valor_cliente',
    ];
    justMoneyFields.map(field => {
        if (values[field] && !REGEX_SOLO_NUMEROS_DINERO.test(values[field])) {
            errors[field] = 'Debe ser un número'
        }
    });

    if (values.valor_cliente) {
        if (values.valor_cliente < 0) {
            errors.valor_cliente = 'El precio debe de ser positivo';
        }
    }
    return errors;
};

export default validate;