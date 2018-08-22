import {REGEX_SOLO_LETRAS, REGEX_SOLO_NUMEROS, REGEX_SOLO_NUMEROS_DINERO} from "../../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'cliente',
        'unidad_negocio',
        'id_proyecto',
        'valor_ofertado',
        'descripcion_cotizacion',
        'orden_compra_fecha',
        'fecha_entrega_pactada',
        'costo_presupuestado',
        'contacto_cliente',
        'dias_espera_cambio_estado',
        'estado_observacion_adicional',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const soloDineroFields = [
        'valor_ofertado',
        'valor_orden_compra',
        'valor_ofertado',
        'costo_presupuestado'
    ];
    soloDineroFields.map(field => {
        if (values[field] && !REGEX_SOLO_NUMEROS_DINERO.test(values[field])) {
            errors[field] = 'Debe ser valores monetarios.'
        }
    });

    if (values.estado && values.estado === 'Aprobado'
        &&
        (!values.orden_compra_nro ||
            (!values.valor_orden_compra || values.valor_orden_compra <= 0))) {
        if (!values.orden_compra_nro) {
            errors.orden_compra_nro = 'Si esta aprobado, debe colocar el nro de la orden de compra';
        }
        if (!values.valor_orden_compra || values.valor_orden_compra <= 0) {
            errors.valor_orden_compra = 'Si esta aprobado, debe colocar el valor de la orden de compra';
        }
    }

    //valor_ofertado

    if (values.id_proyecto) {
        const letras = values.id_proyecto.substring(0, 2);
        const numeros = values.id_proyecto.substring(2, 7);
        if (values.id_proyecto.length !== 7) {
            errors.id_proyecto = 'Debe tener 7 caracteres, 2 letras iniciales y 5 digitos';
        } else {
            if (!REGEX_SOLO_NUMEROS.test(numeros)) {
                errors.id_proyecto = 'Los últimos 5 número deben ser numeros';
            }
            if (!REGEX_SOLO_LETRAS.test(letras)) {
                errors.id_proyecto = 'Los primeros 2 caracteres deben ser letras';
            }
        }
    }

    return errors;
};

export default validate;