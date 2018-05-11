import React, {Fragment} from 'react';
import {MyTextFieldSimple, MyDropdownList} from '../../../../../00_utilities/components/ui/forms/fields';

const FormBaseCotizacion = () => {
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
            <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='Valor Oferta'
                name='valor_ofertado'
            />
            <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='Valor OC'
                name='valor_orden_compra'
            />
            <MyTextFieldSimple
                className="col-12 col-md-4"
                nombre='Costo Presupuestado'
                name='costo_presupuestado'
            />
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
                            'Cotizado',
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
        </Fragment>
    )
};

export default FormBaseCotizacion;