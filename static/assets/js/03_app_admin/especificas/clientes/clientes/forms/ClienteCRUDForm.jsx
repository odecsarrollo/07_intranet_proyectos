import React, {useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../../../../../01_actions/01_index';
import {MyCombobox, MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';

let Form = (props) => {
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
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.fetchColaboradoresnVendedores());
        return () => dispatch(actions.clearColaboradoresn());
    }, []);
    const colaboradores = useSelector(state => state.colaboradoresn);
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
            <MyTextFieldSimple
                className="col-12"
                nombre='Nit'
                name='nit'
                case='U'/>
            <MyTextFieldSimple
                className="col-12"
                nombre='Nombre'
                name='nombre'
                case='U'/>
            <MyCombobox
                className="col-12"
                name='colaborador_componentes'
                label={'Vendedor en Componentes'}
                label_space_xs={4}
                busy={false}
                autoFocus={false}
                data={_.map(colaboradores, c => ({
                    'name': c.to_string,
                    'id': c.id
                }))}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Vendedor en Componentes'
            />

            <MyCombobox
                className="col-12"
                name='colaborador_proyectos'
                label={'Vendedor en Proyectos'}
                label_space_xs={4}
                busy={false}
                autoFocus={false}
                data={_.map(colaboradores, c => ({
                    'name': c.to_string,
                    'id': c.id
                }))}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Vendedor en Proyectos'
            />
        </MyFormTagModal>
    )
};

Form = reduxForm({
    form: "clienteForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;