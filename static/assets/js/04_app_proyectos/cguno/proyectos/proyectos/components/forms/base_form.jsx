import React from 'react';
import {
    MyTextFieldSimple,
    MyCheckboxSimple,
    MyCombobox
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {pesosColombianos, fechaFormatoUno} from '../../../../../../00_utilities/common';


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
                            <span> <strong>Costo Presupuestado: </strong> {pesosColombianos(initialValues.costo_presupuestado)}</span>
                        </div>
                    }
                    {
                        permisos_object.valor &&
                        initialValues &&
                        <div className="col-12 col-md-6">
                            <span> <strong>Valor Orden Compra: </strong> {pesosColombianos(initialValues.valor_cliente)}</span>
                        </div>
                    }
                    {
                        initialValues &&
                        <div className="col-12 col-md-6">
                            <span> <strong>Fecha Orden Compra: </strong> {fechaFormatoUno(initialValues.orden_compra_fecha)}</span>
                        </div>
                    }
                    {
                        initialValues &&
                        <div className="col-12 col-md-6">
                            <span> <strong>Fecha Entrega Pactada: </strong> {fechaFormatoUno(initialValues.fecha_entrega_pactada)}</span>
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
            <MyCheckboxSimple
                className="col-12"
                nombre='Abierto'
                name='abierto'/>
        </div>
    )
};

export default BaseFormProyecto;