import React, {Fragment} from 'react';
import {
    MyTextFieldSimple,
    MyDropdownList,
    MyDateTimePickerField,
    MyCombobox
} from '../../../../../00_utilities/components/ui/forms/fields';

const FormBaseCotizacion = (props) => {
    const {item, en_proceso, esta_aprobado, enviado, clientes_list} = props;
    return (
        <Fragment>
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
            <MyTextFieldSimple
                className="col-12 col-md-5 col-lg-2"
                nombre='Uni. Negocio'
                name='unidad_negocio'
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-12 col-lg-5"
                nombre='Contacto'
                name='contacto'
                case='U'/>
            <MyTextFieldSimple
                className="col-12"
                nombre='Descripción'
                name='descripcion_cotizacion'
                case='U'/>
            <MyTextFieldSimple
                className="col-12"
                nombre='Observación'
                name='observacion'
                multiLine={true}
                rows={2}
                case='U'/>

            <MyDateTimePickerField
                max={new Date(2099, 11, 31)}
                name='fecha_entrega_pactada_cotizacion'
                nombre='Fecha Entrega Cotización'
                className='col-12 col-md-6 col-lg-4'
            />
            {
                item &&
                <div className="col-12">
                    <div className="row mb-4">
                        <div className="col-12">
                            <label>Estado</label>
                        </div>
                        <MyDropdownList
                            className='col-12'
                            name='estado'
                            data={[
                                'Pendiente',
                                'En Proceso',
                                'Enviado',
                                'Seguimiento - 1. Cliente Interesado',
                                'Seguimiento - 2. Esperando Aprobación Presupuesto',
                                'Seguimiento - 3. En Licitación con Presupuesto Aprobado',
                                'Seguimiento - 4. En Negociación',
                                'Seguimiento - 5. Esperando Orden Compra',
                                'Aprobado',
                                'Aplazado',
                                'Perdido',
                            ]}
                        />
                    </div>
                </div>
            }
            {
                enviado &&
                <Fragment>
                    <MyTextFieldSimple
                        className="col-12 col-md-6 col-lg-4"
                        nombre='Valor Oferta'
                        name='valor_ofertado'
                    />
                </Fragment>
            }
            {
                esta_aprobado &&
                <Fragment>
                    <MyDateTimePickerField
                        max={new Date(2099, 11, 31)}
                        name='fecha_entrega_pactada'
                        nombre='Fecha Entrega Proyecto'
                        className='col-12 col-md-6 col-lg-4'
                    />
                    <MyTextFieldSimple
                        className="col-12 col-md-6 col-lg-4"
                        nombre='Costo Presupuestado'
                        name='costo_presupuestado'
                    />
                    <div className='col-12'>
                        <div className="row">
                            <div className='col-12 mt-2'>
                                <h3>Orden de Compra</h3>
                            </div>
                            <MyDateTimePickerField
                                max={new Date(2099, 11, 31)}
                                name='orden_compra_fecha'
                                nombre='Fecha Orden de Compra'
                                className='col-12 col-md-4'
                            />
                            <MyTextFieldSimple
                                className="col-12 col-md-4"
                                nombre='Valor OC'
                                name='valor_orden_compra'
                            />
                            <MyTextFieldSimple
                                className="col-12 col-md-4"
                                nombre='Nro. Orden Compra'
                                name='orden_compra_nro'
                                case='U'/>
                        </div>
                    </div>
                </Fragment>
            }
        </Fragment>
    )
};

export default FormBaseCotizacion;