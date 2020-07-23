import React, {Fragment, memo} from 'react';
import {useSelector} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import {MyCheckboxSimple, MyCombobox, MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import ContactoFormBase
    from "../../../../03_app_admin/especificas/clientes/contactos/components/forms/ContactoFormBase";
import validate from './validate_crear_contacto';

const selector = formValueSelector('crearContactoForm');

let CrearContactoForm = memo(props => {
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
        clientes,
        error
    } = props;
    console.log(error, 'el error')
    console.log(props, 'los props')
    const myValues = useSelector(state => selector(state, 'nuevo_cliente', ''));
    const {nuevo_cliente} = myValues;
    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            {!nuevo_cliente &&
            <MyCombobox
                className="col-12"
                label='Cliente'
                name='cliente'
                busy={false}
                autoFocus={false}
                data={_.map(_.orderBy(clientes, ['nombre'], ['asc']), e => {
                    return {
                        'name': e.nombre,
                        'id': e.id
                    }
                })}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Cliente'
            />}
            <div className="col-12">
                <div className="row">
                    <MyCheckboxSimple
                        className="col-12 col-md-6"
                        label='Crear Cliente'
                        name='nuevo_cliente'
                    />
                </div>
            </div>
            {nuevo_cliente &&
            <Fragment>
                <MyTextFieldSimple
                    className="col-6"
                    nombre='Nit'
                    name='cliente_nit'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Razón Social Cliente'
                    name='cliente_nombre'
                    case='U'/>
            </Fragment>}
            <ContactoFormBase/>
            {error && <strong style={{color: 'red'}}>{error}</strong>}
        </MyFormTagModal>
    )
});

CrearContactoForm = reduxForm({
    form: "crearContactoForm",
    validate: validate,
    enableReinitialize: true
})(CrearContactoForm);

export default CrearContactoForm;