import {REGEX_CORREO_ELECTRONICO} from "../../../../00_utilities/common";

const validate = values => {
    const errors = {};

    const requiredFields = [
        'nro_orden_compra',
        'divisa',
        'tipo_documento',
        'fecha',
        'nombre_cliente',
        'nit',
        'fecha_seguimiento',
        'informacion_cliente',
        'condicion_pago',
        'email_destinatario',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    if (values.email_destinatario && !REGEX_CORREO_ELECTRONICO.test(values.email_destinatario)) {
        errors.email_destinatario = 'Correo Electrónico Inválido';
    }

    if (values.email_destinatario_dos && !REGEX_CORREO_ELECTRONICO.test(values.email_destinatario_dos)) {
        errors.email_destinatario_dos = 'Correo Electrónico Inválido';
    }
    return errors;
};

export default validate;