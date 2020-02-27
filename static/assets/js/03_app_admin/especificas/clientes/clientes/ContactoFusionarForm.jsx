import React, {memo} from 'react';
import {formValueSelector, reduxForm} from 'redux-form';
import {MyCombobox} from '../../../../00_utilities/components/ui/forms/fields';
import {useDispatch, useSelector} from "react-redux";
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import * as actions from '../../../../01_actions/01_index';
import validate from './forms/validate_fusionar_contacto';

const selector = formValueSelector('contactoFusionForm');
let Form = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onCancel,
        cargarContactos,
        handleSubmit,
        modal_open,
        list
    } = props;
    const dispatch = useDispatch();
    const myValues = useSelector(state => selector(state, 'contacto_que_permanece_id', 'contacto_a_eliminar_id'));
    const {contacto_que_permanece_id = null, contacto_a_eliminar_id = null} = myValues;
    const onSubmit = (v) => {
        const cargarContactosCliente = () => {
            cargarContactos();
            onCancel();
        };
        dispatch(
            actions.fusionarContactosCliente(
                v.contacto_que_permanece_id,
                v.contacto_a_eliminar_id,
                {callback: cargarContactosCliente}
            ))
    };
    const contact_que_permanece = contacto_que_permanece_id ? list[contacto_que_permanece_id] : null;
    const contacto_a_eliminar = contacto_a_eliminar_id ? list[contacto_a_eliminar_id] : null;
    const nombres_iguales = contact_que_permanece && contacto_a_eliminar && contact_que_permanece.nombres === contacto_a_eliminar.nombres;
    const apellidos_iguales = contact_que_permanece && contacto_a_eliminar && contact_que_permanece.apellidos === contacto_a_eliminar.apellidos;
    return (
        <MyFormTagModal
            onCancel={onCancel}
            fullScreen={false}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={'Cliente'}
            submit_text_boton={'Fusionar'}
        >
            <MyCombobox
                className="col-12"
                name='contacto_que_permanece_id'
                busy={false}
                autoFocus={false}
                data={_.map(_.pickBy(list, c => c.id !== parseInt(contacto_a_eliminar_id)), e => {
                    return {
                        'name': `${e.nombres} ${e.apellidos}-${e.id}`,
                        'id': e.id
                    }
                })}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Contacto que permanece'
            />
            <MyCombobox
                className="col-12"
                name='contacto_a_eliminar_id'
                busy={false}
                autoFocus={false}
                data={_.map(_.pickBy(list, c => c.id !== parseInt(contacto_que_permanece_id)), e => {
                    return {
                        'name': `${e.nombres} ${e.apellidos}-${e.id}`,
                        'id': e.id
                    }
                })}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Contacto a Fusionar'
            />
            {contact_que_permanece && contacto_a_eliminar && <div className='col-12'>
                <div className="row">
                    <div className="col-12">Desea realmente fusionar los contactos?</div>
                    <div className="col-12">
                        Fusiona: {contact_que_permanece.id} - {contact_que_permanece.nombres} {contact_que_permanece.apellidos}
                    </div>
                    <div className="col-12">
                        Elimina: {contacto_a_eliminar.id} - {contacto_a_eliminar.nombres} {contacto_a_eliminar.apellidos}
                    </div>
                    {(!nombres_iguales || !apellidos_iguales) &&
                    <div className='col-12' style={{color: 'red', fontSize: '2rem'}}>
                        ATENCION: Los nombres de los contactos no coinciden...
                    </div>}
                </div>
            </div>}
            <div style={{height: '300px'}}></div>
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "contactoFusionForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;