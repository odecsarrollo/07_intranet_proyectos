import {REGEX_SOLO_NUMEROS_DINERO} from '../../../../00_utilities/common';

const validate = values => {
    const errors = {};

    const requiredFields = [
        'nombres',
        'apellidos',
        'cedula',
        'nro_horas_mes',
        'porcentaje_caja_compensacion',
        'porcentaje_pension',
        'porcentaje_arl',
        'porcentaje_salud',
        'porcentaje_prestaciones_sociales',
        'base_salario',
        'auxilio_transporte',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

    const soloNumerosFields = [
        'porcentaje_caja_compensacion',
        'porcentaje_pension',
        'porcentaje_arl',
        'porcentaje_salud',
        'porcentaje_prestaciones_sociales',
    ];
    soloNumerosFields.map(field => {
        if (values[field] && !REGEX_SOLO_NUMEROS_DINERO.test(values[field])) {
            errors[field] = 'Debe ser sólo números'
        }
    });

    return errors;
};

export default validate;