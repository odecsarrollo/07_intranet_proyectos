import React, {Fragment} from 'react';
import {
    MyTextFieldSimple,
    MyDropdownList,
    MyDateTimePickerField,
    MyCombobox,
    MyCheckboxSimple
} from '../../../../00_utilities/components/ui/forms/fields';

const FormBaseCotizacion = (props) => {
    const {
        item,
        clientes_list,
        cargarContactosCliente,
        contactos_list,
        myValues
    } = props;
    const {estado, subir_anterior} = myValues;
    const comentario_estado = estado && (
        estado === 'Evaluación Técnica y Económinca'
        || estado === 'Aceptación de Terminos y Condiciones'
        || estado === 'Perdido'
        || estado === 'Aplazado'
        || estado === 'Cancelado'
    );
    const esta_aprobado = estado === 'Cierre (Aprobado)';
    const en_proceso = estado && estado !== 'Cita/Generación Interés' && estado !== 'Aplazado' && estado !== 'Perdido' && estado !== 'Cancelado';
    const enviado = en_proceso && estado !== 'Configurando Propuesta';
    const pedir_dias_espera_cambio_estado = (
        estado !== 'Cierre (Aprobado)' &&
        estado !== 'Perdido' &&
        estado !== 'Cancelado'
    );
    let estados_lista = [
        'Cita/Generación Interés',
        'Configurando Propuesta',
        'Cotización Enviada',
        'Evaluación Técnica y Económica',
        'Aceptación de Terminos y Condiciones',
        'Cierre (Aprobado)',
        'Aplazado',
        'Cancelado',
        //'Perdido',
    ];
    if (subir_anterior) {
        estados_lista = [
            'Cita/Generación Interés',
            'Configurando Propuesta',
            'Cotización Enviada',
            'Evaluación Técnica y Económica',
            'Aceptación de Terminos y Condiciones'
        ];
    }
    return (
        <Fragment>
            <div className="col-12">
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            {
                                !item &&
                                <MyCheckboxSimple
                                    className="col-6 pt-4"
                                    name='subir_anterior'
                                    nombre='subir anterior'
                                />
                            }
                            {
                                subir_anterior &&
                                <MyTextFieldSimple
                                    className="col-6"
                                    nombre='Nro. Cotización'
                                    name='nro_cotizacion'
                                    type='number'
                                />
                            }
                        </div>
                    </div>
                    <MyCombobox
                        className="col-12 col-md-6"
                        name='cliente'
                        data={_.map(_.orderBy(clientes_list, ['nombre'], ['asc']), e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        valuesField='id'
                        placeholder='Cliente'
                        filter='contains'
                        onSelect={(v) => cargarContactosCliente(v.id)}
                    />
                    {
                        myValues && myValues.cliente &&
                        <MyCombobox
                            className="col-12 col-md-6"
                            name='contacto_cliente'
                            data={_.map(_.orderBy(contactos_list, ['full_nombre'], ['asc']), e => {
                                return {
                                    'name': e.full_nombre,
                                    'id': e.id
                                }
                            })}
                            textField='name'
                            filter='contains'
                            valuesField='id'
                            placeholder='Contacto'
                        />
                    }
                </div>
            </div>
            <MyTextFieldSimple
                className="col-12 col-md-2"
                nombre='Uni. Negocio'
                name='unidad_negocio'
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-10"
                nombre='Descripción'
                name='descripcion_cotizacion'
                case='U'/>
            {
                item && !item.contacto_cliente &&
                <MyTextFieldSimple
                    className="col-12 col-md-12 col-lg-5"
                    nombre='Contacto'
                    name='contacto'
                    case='U'/>
            }
            <MyDropdownList
                className='col-12 col-md-8'
                name='origen_cotizacion'
                label='Origen Cotización'
                data={[
                    'Comercial',
                    'Mercadeo',
                    'Gerencia',
                    'Componentes',
                    'Técnico',
                ]}
            />
            <MyTextFieldSimple
                className="col-12"
                nombre='Observación'
                name='observacion'
                multiline={true}
                rows={2}
                case='U'/>
            <MyDateTimePickerField
                max={new Date(2099, 11, 31)}
                name='fecha_entrega_pactada_cotizacion'
                nombre='Fecha Entrega Cotización'
                className='col-12 col-md-6 col-lg-4'
            />
            {
                !item && !subir_anterior &&
                <MyDateTimePickerField
                    max={new Date(2099, 11, 31)}
                    name='fecha_limite_segumiento_estado'
                    nombre='Verificar el...'
                    className="col-12 col-md-4"
                />
            }
            {
                (item || subir_anterior) &&
                <Fragment>
                    <div className="col-12">
                        <div className="row mb-4">
                            <MyDropdownList
                                className='col-12 col-md-8'
                                name='estado'
                                label='Estado'
                                data={estados_lista}
                            />
                            {
                                pedir_dias_espera_cambio_estado &&
                                <MyDateTimePickerField
                                    max={new Date(2099, 11, 31)}
                                    name='fecha_limite_segumiento_estado'
                                    nombre='Verificar el...'
                                    className="col-12 col-md-4"
                                />
                            }
                        </div>
                    </div>
                </Fragment>
            }
            {
                comentario_estado &&
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Observación Estado'
                    name='estado_observacion_adicional'
                    case='U'/>
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