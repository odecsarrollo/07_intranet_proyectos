import React, {memo, useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";


let Form = memo((props) => {
    const dispatch = useDispatch();
    const {
        pristine,
        submitting,
        reset,
        item_seleccionado,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name
    } = props;
    useEffect(() => {
        dispatch(actions.fetchPaises());
        return () => {
            dispatch(actions.clearPaises());
        };
    }, []);
    const paises = useSelector(state => state.geografia_paises);
    return (
        <MyFormTagModal
            onCancel={onCancel}
            fullScreen={false}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={item_seleccionado}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <MyTextFieldSimple
                className="col-12"
                nombre='Nombre'
                name='nombre'
                case='U'/>
            <MyCombobox
                className="col-12"
                name='pais'
                busy={false}
                autoFocus={false}
                data={_.map(paises, e => {
                    return {
                        'name': e.nombre,
                        'id': e.id
                    }
                })}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Paises'
            />
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "departamentoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;