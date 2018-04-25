import React from 'react';
import {
    MyTextFieldSimple,
    MyDateTimePickerField,
    MyCheckboxSimple
} from '../../../../../../../00_utilities/components/ui/forms/fields';


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
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Nro. Orden Compra'
                name='orden_compra_nro'
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Precio Orden Compra'
                name='valor_cliente'
            />
            <MyDateTimePickerField
                name='orden_compra_fecha'
                nombre='Fecha Orden de Compra'
                className='col-12 col-md-6'
            />
            <MyDateTimePickerField
                name='fecha_entrega_pactada'
                nombre='Fecha Entrega Pactada'
                className='col-12 col-md-6'
            />
            <MyCheckboxSimple
                className="col-12"
                nombre='Abierto'
                name='abierto'/>
        </div>
    )
};

export default BaseFormLiteral;