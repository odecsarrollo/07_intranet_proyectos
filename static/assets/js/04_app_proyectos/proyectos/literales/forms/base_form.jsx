import React from 'react';
import {
    MyTextFieldSimple,
    MyCheckboxSimple
} from '../../../../00_utilities/components/ui/forms/fields';


const BaseFormLiteral = (props) => {
    const {initialValues = null} = props;
    return (
        <div className='row'>
            {
                (
                    (initialValues && !initialValues.en_cguno) ||
                    (!initialValues)
                )
                &&
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Descripción'
                    name='descripcion'
                    case='U'/>
            }
            {
                initialValues &&
                <MyCheckboxSimple
                    className="col-12"
                    nombre='Abierto'
                    name='abierto'/>
            }
        </div>
    )
};

export default BaseFormLiteral;