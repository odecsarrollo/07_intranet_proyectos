import React from 'react';
import {
    MyTextFieldSimple,
    MyDateTimePickerField,
    MyCheckboxSimple,
    MyCombobox
} from '../../../../../../../00_utilities/components/ui/forms/fields';


const BaseFormLiteral = (props) => {
    const {initialValues = null, permisos_object, clientes_list} = props;
    return (
        <div className="row">
            {!initialValues || !initialValues.en_cguno ?
                <MyTextFieldSimple
                    className="col-12"
                    nombre='OP Proyecto'
                    name='id_proyecto'
                    case='U'/> :
                <div className="col-12">
                    <span>{initialValues.id_proyecto}</span>
                </div>
            }
            <MyCombobox
                className="col-12"
                name='cliente'
                data={_.map(clientes_list, e => {
                    return {
                        'name': e.nombre,
                        'id': e.id
                    }
                })}
                textField='name'
                valuesField='id'
                placeholder='Cliente'
            />
            {
                permisos_object.costo_presupuestado &&
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Costo Presupuestado'
                    name='costo_presupuestado'/>
            }
            {
                permisos_object.valor &&
                <MyTextFieldSimple
                    className="col-12 col-md-6"
                    nombre='Precio'
                    name='valor_cliente'
                    case='U'/>

            }
            <MyTextFieldSimple
                className="col-12"
                nombre='Nombre Proyecto'
                name='nombre'
                case='U'/>

            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Nro. Cotización'
                name='cotizacion_nro'
                case='U'/>

            <MyTextFieldSimple
                className="col-12 col-md-6"
                nombre='Nro. Orden Compra'
                name='orden_compra_nro'
                case='U'/>

            <div className="col-12">
                <div className="row">
                    <MyDateTimePickerField
                        max={new Date(2099, 11, 31)}
                        name='orden_compra_fecha'
                        nombre='Fecha Orden de Compra'
                        className='col-12 col-md-6'
                    />
                    <MyDateTimePickerField
                        max={new Date(2099, 11, 31)}
                        name='fecha_entrega_pactada'
                        nombre='Fecha Entrega Pactada'
                        className='col-12 col-md-6'
                    />
                </div>
            </div>
            <MyCheckboxSimple
                className="col-12"
                nombre='Abierto'
                name='abierto'/>
        </div>
    )
};

export default BaseFormLiteral;