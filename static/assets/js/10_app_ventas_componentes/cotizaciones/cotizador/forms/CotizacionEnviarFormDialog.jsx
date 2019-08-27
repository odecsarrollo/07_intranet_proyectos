import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyCheckboxSimple, MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';

let CotizacionEnviarFormDialog = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name,
        contacto,
        auth
    } = props;
    const {
        correo_electronico,
        correo_electronico_2
    } = contacto;
    const {mi_cuenta: {email}} = auth;
    return (
        <MyFormTagModal
            submit_text_boton='Enviar'
            onCancel={onCancel}
            onSubmit={handleSubmit((v) => {
                let envio = v.email_uno ? {...v, email_uno: correo_electronico} : _.omit(v, 'email_uno');
                envio = envio.email_dos ? {...envio, email_dos: correo_electronico_2} : _.omit(envio, 'email_dos');
                envio = envio.email_asesor ? {...envio, email_asesor: email} : _.omit(envio, 'email_asesor');
                return onSubmit(envio)
            })}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            {correo_electronico &&
            <MyCheckboxSimple
                nombre={correo_electronico.toString().toLowerCase()}
                name='email_uno'
                className='col-12'/>}
            {correo_electronico_2 &&
            <MyCheckboxSimple
                nombre={correo_electronico_2.toString().toLowerCase()}
                name='email_dos'
                className='col-12'/>}
            {email &&
            <MyCheckboxSimple
                nombre={email.toString().toLowerCase()}
                name='email_asesor'
                className='col-12'/>}
            <MyTextFieldSimple
                className='col-12'
                name='email_tres'
                nombre='Email Adicional'
                type='email'
            />
            <MyTextFieldSimple
                className='col-12'
                name='email_cuatro'
                nombre='Email Adicional'
                type='email'
            />
        </MyFormTagModal>
    )
});

CotizacionEnviarFormDialog = reduxForm({
    form: "cotizacionEnviarForm",
    validate,
    enableReinitialize: true
})(CotizacionEnviarFormDialog);

export default CotizacionEnviarFormDialog;