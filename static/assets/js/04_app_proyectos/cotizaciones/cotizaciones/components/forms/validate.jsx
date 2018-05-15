import {REGEX_SOLO_NUMEROS_DINERO} from "../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'cliente',
        'unidad_negocio',
        'descripcion_cotizacion'
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const soloDineroFields = [
        'valor_ofertado',
        'valor_orden_compra',
        'costo_presupuestado'
    ];
    soloDineroFields.map(field => {
        if (values[field] && !REGEX_SOLO_NUMEROS_DINERO.test(values[field])) {
            errors[field] = 'Debe ser valores monetarios.'
        }
    });
    return errors;
};

export default validate;