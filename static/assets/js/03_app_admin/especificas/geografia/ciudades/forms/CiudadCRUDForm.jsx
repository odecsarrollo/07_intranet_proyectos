import React, {memo, useEffect} from 'react';
import {reduxForm, formValueSelector} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCombobox
} from '../../../../../00_utilities/components/ui/forms/fields';
import {useSelector, useDispatch} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import * as actions from "../../../../../01_actions/01_index";

const selector = formValueSelector('ciudadesForm');


let Form = memo((props) => {
    const dispatch = useDispatch();
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
    } = props;
    useEffect(() => {
        dispatch(actions.fetchPaises());
        dispatch(actions.fetchDepartamentos());
        return () => {
            dispatch(actions.clearPaises());
            dispatch(actions.clearDepartamentos());
        };
    }, []);
    const paises = useSelector(state => state.geografia_paises);
    const departamentos = useSelector(state => state.geografia_departamentos);
    const form_values = useSelector(state => selector(state, 'pais', 'departamento'));
    const departamentos_list_por_pais = form_values && form_values.pais ? _.pickBy(departamentos, e => e.pais === form_values.pais) : null;
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
            {
                departamentos_list_por_pais &&
                _.size(departamentos_list_por_pais) > 0 &&
                <MyCombobox
                    className="col-12"
                    name='departamento'
                    busy={false}
                    autoFocus={false}
                    data={_.map(departamentos_list_por_pais, e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Departamentos'
                />
            }
        </MyFormTagModal>
    )
});
Form = reduxForm({
    form: "ciudadesForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;