import React, {Fragment} from 'react';
import {
    MyTextFieldSimple,
    MyDropdownList,
    MyDateTimePickerField
} from '../../../../../00_utilities/components/ui/forms/fields';

const FormBaseCotizacion = (props) => {
    const {item, en_proceso, esta_aprobado} = props;
    return (
        <Fragment>
            <MyTextFieldSimple
                className="col-12 col-md-7 col-lg-5"
                nombre='Cliente'
                name='cliente'
                case='U'/>
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
                en_proceso &&
                <Fragment>
                    <MyTextFieldSimple
                        className="col-12 col-md-6 col-lg-4"
                        nombre='Valor Oferta'
                        name='valor_ofertado'
                    />
                    <MyTextFieldSimple
                        className="col-12 col-md-6 col-lg-4"
                        nombre='Costo Presupuestado'
                        name='costo_presupuestado'
                    />
                    <MyDateTimePickerField
                        max={new Date(2099, 11, 31)}
                        name='fecha_entrega_pactada'
                        nombre='Fecha Entrega Pactada'
                        className='col-12 col-md-6 col-lg-4'
                    />
                </Fragment>
            }
            {
                esta_aprobado &&
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
            }
        </Fragment>
    )
};

export default FormBaseCotizacion;