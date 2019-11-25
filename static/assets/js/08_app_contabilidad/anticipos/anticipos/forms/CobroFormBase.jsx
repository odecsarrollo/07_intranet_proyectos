import React, {memo, Fragment, useState} from 'react';
import {
    MyTextFieldSimple,
    MyCombobox,
    MyDateTimePickerField
} from '../../../../00_utilities/components/ui/forms/fields';
import {reduxForm} from "redux-form";
import BotoneriaModalForm from "../../../../00_utilities/components/ui/forms/botoneria_modal_form";

let Form = memo(props => {
    const {
        handleSubmit,
        pristine,
        submitting,
        reset,
        mostrar_cancelar = false,
        initialValues = null,
        onSubmit,
        onCancel,
    } = props;
    const cobro = initialValues;
    const editable = cobro ? cobro.editable : true;
    const esta_cerrada = cobro ? cobro.estado === 'CERRADA' : false;
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <MyCombobox
                    className="col-12 col-md-6 col-lg-4"
                    data={[
                        {id: 'COP', nombre: 'COP'},
                        {id: 'USD', nombre: 'USD'},
                        {id: 'EUR', nombre: 'EUR'},
                    ]}
                    filter='contains'
                    label='Tipo de Divisa'
                    label_space_xs={3}
                    placeholder='Seleccionar Tipo de Divisa...'
                    valueField='id'
                    textField='nombre'
                    name='divisa'
                    readOnly={!editable}
                />
                <MyCombobox
                    label='Tipo Documento'
                    label_space_xs={3}
                    className="col-12 col-md-6 col-lg-4"
                    data={[
                        {id: 'PROFORMA', nombre: 'Proforma'},
                        {id: 'CUENTA_COBRO', nombre: 'Cuenta Cobro'},
                    ]}
                    filter='contains'
                    placeholder='Seleccionar Tipo de Documento...'
                    valueField='id'
                    textField='nombre'
                    name='tipo_documento'
                    readOnly={!editable}
                />
                <MyDateTimePickerField
                    label_space_xs={3}
                    label='Fecha'
                    className='col-12 col-md-6 col-lg-4'
                    name='fecha'
                    dropUp={false}
                    readOnly={!editable}
                />
                <MyTextFieldSimple
                    className="col-12 col-md-6 col-lg-4 pr-4"
                    nombre='Nombre Cliente'
                    name='nombre_cliente'
                    disabled={!editable}
                />
                <MyTextFieldSimple
                    className="col-12 col-md-6 col-lg-3 pr-3"
                    nombre='Nit'
                    name='nit'
                    disabled={!editable}
                />
                <MyTextFieldSimple
                    className="col-12 col-md-6 col-lg-2 pr-3"
                    nombre='Nro. Orden Compra'
                    name='nro_orden_compra'
                    disabled={!editable}
                />
                {
                    cobro &&
                    !esta_cerrada &&
                    <MyDateTimePickerField
                        max={new Date(2099, 11, 31)}
                        name='fecha_seguimiento'
                        label='Verificar el...'
                        label_space_xs={4}
                        className="col-12 col-md-6 col-lg-2 col-md-3"
                    />
                }
                <div className='col-12'>
                    <div className="row">
                        <MyTextFieldSimple
                            multiline
                            rows={4}
                            className="col-12 col-md-5 pr-3"
                            nombre='Cliente'
                            name='informacion_cliente'
                            disabled={!editable}
                            case='U'/>
                        <MyTextFieldSimple
                            multiline
                            rows={4}
                            className="col-12 col-md-4 pr-3"
                            nombre='Locatario'
                            name='informacion_locatario'
                            disabled={!editable}
                            case='U'/>
                        <MyTextFieldSimple
                            className="col-12 col-md-3 pr-3"
                            nombre='Condición Pago'
                            name='condicion_pago'
                            multiline={true}
                            rows={4}
                            disabled={!editable}
                        />
                    </div>
                </div>
                {
                    cobro &&
                    <Fragment>
                        <MyTextFieldSimple
                            className="col-12"
                            nombre='Observación'
                            name='observacion'
                            multiline
                            rows={3}
                            disabled={!editable}
                        />
                        <div className="col-12">
                            <div className="row">
                                <div className="col-12">Destinatario Correo:</div>
                                <MyTextFieldSimple
                                    className="col-12 col-md-6 pr-3"
                                    nombre='Email Destino'
                                    name='email_destinatario'
                                    case='U'
                                    type='email'
                                    disabled={!editable}
                                />
                                <MyTextFieldSimple
                                    className="col-12 col-md-6 pr-3"
                                    nombre='Email Destino Dos'
                                    name='email_destinatario_dos'
                                    case='U'
                                    type='email'
                                    disabled={!editable}
                                />
                            </div>
                        </div>
                        {
                            cobro.items.length > 0 &&
                            <MyTextFieldSimple
                                className="col-12 col-md-6 pr-3"
                                nombre='Impuesto'
                                name='impuesto'
                                case='U'
                                type='number'
                                disabled={!editable}
                            />
                        }
                    </Fragment>
                }
            </div>
            <BotoneriaModalForm
                mostrar_submit={true}
                mostrar_limpiar={true}
                mostrar_cancelar={mostrar_cancelar}
                onCancel={onCancel}
                pristine={pristine}
                reset={reset}
                submitting={submitting}
                initialValues={cobro}
            />
        </form>
    )
});

Form = reduxForm({
    form: "proformaAnticipoForm",
    enableReinitialize: true
})(Form);

export default Form;