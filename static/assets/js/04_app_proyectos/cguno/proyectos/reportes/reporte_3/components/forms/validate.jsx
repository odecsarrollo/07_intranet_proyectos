import {REGEX_SOLO_NUMEROS, REGEX_SOLO_LETRAS} from "../../../../../../../00_utilities/common";

const validate = values => {
    const errors = {};


    const requiredFields = [
        'id_proyecto',
    ];
    requiredFields.map(field => {
        if (!values[field]) {
            errors[field] = 'Requerido'
        }
    });

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