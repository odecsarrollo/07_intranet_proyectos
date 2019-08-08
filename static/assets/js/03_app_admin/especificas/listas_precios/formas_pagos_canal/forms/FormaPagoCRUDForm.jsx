import React, {memo, useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {MyCombobox, MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {useSelector, useDispatch} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import * as actions from '../../../../../01_actions/01_index';

let Form = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name
    } = props;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.fetchCanalesDistribuciones());
        return () => {
            dispatch(actions.clearCanalesDistribuciones());
        }
    }, []);
    const canales_list = useSelector(state => state.clientes_canales);

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
            element_type={singular_name}
        >
            <MyTextFieldSimple
                className="col-12"
                nombre='Forma Pago'
                name='forma'
                case='U'/>
            <MyCombobox
                className="col-6"
                name='canal'
                busy={false}
                autoFocus={false}
                data={_.map(canales_list, e => {
                    return {
                        'name': e.nombre,
                        'id': e.id
                    }
                })}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Canal'
            />
            <MyTextFieldSimple
                className="col-3"
                nombre='Porcentaje'
                name='porcentaje'
                type='number'/>
        </MyFormTagModal>
    )
});


Form = reduxForm({
    form: "formaPagoCanalForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;