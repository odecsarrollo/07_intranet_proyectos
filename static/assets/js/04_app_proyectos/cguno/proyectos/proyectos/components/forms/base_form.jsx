import React from 'react';
import {
    MyTextFieldSimple,
    MyDateTimePickerField,
    MyCheckboxSimple,
    MyCombobox
} from '../../../../../../00_utilities/components/ui/forms/fields';


const BaseFormProyecto = (props) => {
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
            <div className="col-12">
                <div className="row">
                    {
                        permisos_object.costo_presupuestado &&
                        initialValues &&
                        <div className="col-12 col-md-6">
                            <span> <strong>Costo Presupuestado: </strong> {initialValues.costo_presupuestado}</span>
                        </div>
                    }
                    {
                        permisos_object.valor &&
                        initialValues &&
                        <div className="col-12 col-md-6">
                            <span> <strong>Valor Orden Compra: </strong> {initialValues.valor_cliente}</span>
                        </div>
                    }
                </div>
            </div>
            {
                initialValues &&
                initialValues.cotizacion_nro &&
                <div className="col-12 col-md-6">
                    <span><strong>Nro. Cotización: </strong>{initialValues.cotizacion_nro}</span>
                </div>
            }
            <MyTextFieldSimple
                className="col-12"
                nombre='Nombre Proyecto'
                name='nombre'
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

export default BaseFormProyecto;