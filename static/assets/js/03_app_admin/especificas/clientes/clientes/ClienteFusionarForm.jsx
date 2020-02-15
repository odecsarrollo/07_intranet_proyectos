import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyCombobox} from '../../../../00_utilities/components/ui/forms/fields';
import {useDispatch} from "react-redux";
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import * as actions from '../../../../01_actions/01_index';
import validate from './forms/validate_fusionar_cliente';

let Form = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onCancel,
        handleSubmit,
        modal_open,
        list
    } = props;
    const dispatch = useDispatch();

    const onSubmit = (v) => {
        const cargarClientes = () => {
            dispatch(actions.fetchClientes({callback: onCancel}));
        };
        dispatch(
            actions.fusionarClientes(
                v.cliente_que_permanece_id,
                v.cliente_a_eliminar_id,
                {callback: cargarClientes}
            ))
    };

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
                name='cliente_que_permanece_id'
                busy={false}
                autoFocus={false}
                data={_.map(_.pickBy(list, c => c.sincronizado_sistemas_informacion && !c.nueva_desde_cotizacion), e => {
                    return {
                        'name': `${e.nombre} - ${e.nit}`,
                        'id': e.id
                    }
                })}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Cliente que permanece'
            />
            <MyCombobox
                className="col-12"
                name='cliente_a_eliminar_id'
                busy={false}
                autoFocus={false}
                data={_.map(_.pickBy(list, c => (!c.sincronizado_sistemas_informacion || c.nueva_desde_cotizacion)), e => {
                    return {
                        'name': `${e.nombre} - ${e.nit}`,
                        'id': e.id
                    }
                })}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Cliente a Fusionar'
            />
            <div style={{height: '300px'}}></div>
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "clienteFusionForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;