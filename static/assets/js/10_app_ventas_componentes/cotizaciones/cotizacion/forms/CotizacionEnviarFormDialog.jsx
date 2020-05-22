import React, {memo, Fragment} from 'react';
import {useSelector} from "react-redux";
import {reduxForm, formValueSelector} from 'redux-form';
import {fechaToYMD} from "../../../../00_utilities/common";
import {
    MyCheckboxSimple,
    MyTextFieldSimple,
    MyDateTimePickerField
} from '../../../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import {useAuth} from "../../../../00_utilities/hooks";

const selector = formValueSelector('cotizacionEnviarForm');

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
        estado_cotizacion,
    } = props;
    const values = useSelector(state => selector(state, 'no_enviar', 'email_uno', 'email_dos', 'email_tres', 'email_cuatro', 'email_asesor'));
    const {no_enviar, email_uno, email_dos, email_tres, email_cuatro, email_asesor} = values;
    const enviara = email_uno || email_dos || email_tres || email_cuatro || email_asesor;
    const {
        correo_electronico,
        correo_electronico_2
    } = contacto;
    const authentication = useAuth();
    const {auth: {user: {email}}} = authentication;
    return (
        <MyFormTagModal
            submit_text_boton='Enviar'
            onCancel={onCancel}
            onSubmit={handleSubmit((v) => {
                let envio = v.email_uno ? {...v, email_uno: correo_electronico} : _.omit(v, 'email_uno');
                envio = envio.email_dos ? {...envio, email_dos: correo_electronico_2} : _.omit(envio, 'email_dos');
                envio = envio.email_asesor ? {...envio, email_asesor: email} : _.omit(envio, 'email_asesor');
                envio = envio.fecha_verificacion_proximo_seguimiento ? {
                    ...envio,
                    fecha_verificacion_proximo_seguimiento: fechaToYMD(envio.fecha_verificacion_proximo_seguimiento)
                } : envio;
                return onSubmit(envio, v.no_enviar)
            })}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            {!enviara && <MyCheckboxSimple
                label='Solo descargar para envíar por otro medio'
                name='no_enviar'
                className='col-12'
            />}
            {!no_enviar && <Fragment>
                {correo_electronico && <MyCheckboxSimple
                    label={correo_electronico.toString().toLowerCase()}
                    name='email_uno'
                    className='col-12'/>}
                {correo_electronico_2 && <MyCheckboxSimple
                    label={correo_electronico_2.toString().toLowerCase()}
                    name='email_dos'
                    className='col-12'/>}
                {email && <MyCheckboxSimple
                    label={email.toString().toLowerCase()}
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
            </Fragment>}
            {estado_cotizacion === 'INI' && <Fragment>
                <MyDateTimePickerField
                    name='fecha_verificacion_proximo_seguimiento'
                    label='Fecha verificación'
                    className='col-12'
                    label_space_xs={4}
                    min={new Date()}
                    max={new Date(3000, 1, 1)}
                />
                <div style={{height: '300px'}}/>
            </Fragment>}
        </MyFormTagModal>
    )
});

CotizacionEnviarFormDialog = reduxForm({
    form: "cotizacionEnviarForm",
    validate,
    enableReinitialize: true
})(CotizacionEnviarFormDialog);

export default CotizacionEnviarFormDialog;