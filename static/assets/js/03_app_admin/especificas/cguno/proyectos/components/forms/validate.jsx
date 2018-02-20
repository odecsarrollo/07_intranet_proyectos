import {REGEX_SOLO_NUMEROS_DINERO} from "../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};
    if (!values.id_proyecto) {
        errors.id_proyecto = 'Requerido';
    }

    if (!values.costo_presupuestado) {
        errors.costo_presupuestado = 'Requerido';
    } else {
        if (values.costo_presupuestado < 0) {
            errors.costo_presupuestado = 'El costo presupuestado debe de ser positivo';
        }
        if (!REGEX_SOLO_NUMEROS_DINERO.test(values.costo_presupuestado)) {
            errors.costo_presupuestado = 'Debe ser solamente números';
        }
    }

    if (!values.valor_cliente) {
        errors.valor_cliente = 'Requerido';
    } else {
        if (values.valor_cliente < 0) {
            errors.valor_cliente = 'El precio debe de ser positivo';
        }
        if (!REGEX_SOLO_NUMEROS_DINERO.test(values.valor_cliente)) {
            errors.valor_cliente = 'Debe ser solamente números';
        }
    }
    return errors;
};

export default validate;