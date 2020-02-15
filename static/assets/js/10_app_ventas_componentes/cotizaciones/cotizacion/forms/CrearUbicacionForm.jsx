import React, {memo, useEffect} from 'react';
import * as actions from '../../../../01_actions/01_index';
import {useDispatch, useSelector} from 'react-redux';
import {reduxForm, formValueSelector} from 'redux-form';
import {MyCombobox, MyTextFieldSimple, MyCheckboxSimple} from '../../../../00_utilities/components/ui/forms/fields';
import validate from './validate_crear_ciudad';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';

const selector = formValueSelector('crearUbicacionForm');

let CrearUbicacionForm = memo(props => {
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
    const myValues = useSelector(state => selector(state, 'nuevo_departamento', 'nuevo_pais', 'pais'));
    const {nuevo_departamento, nuevo_pais, pais} = myValues;
    useEffect(() => {
        const cargarDepartamentos = () => dispatch(actions.fetchDepartamentos());
        dispatch(actions.fetchPaises({callback: cargarDepartamentos}));
        return () => {
            dispatch(actions.clearPaises());
            dispatch(actions.clearDepartamentos());
        }
    }, []);
    const paises = useSelector(state => state.geografia_paises);
    const departamentos = useSelector(state => state.geografia_departamentos);
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
            {!nuevo_pais &&
            <MyCombobox
                className="col-12"
                name='pais'
                busy={false}
                autoFocus={false}
                data={_.map(_.orderBy(paises, ['nombre'], ['asc']), e => {
                    return {
                        'name': e.nombre,
                        'id': e.id
                    }
                })}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='País'
            />}
            {!nuevo_pais && !nuevo_departamento &&
            <MyCombobox
                className="col-12"
                name='departamento'
                busy={false}
                autoFocus={false}
                data={_.map(_.orderBy(_.pickBy(departamentos, d => d.pais === pais), ['nombre'], ['asc']), e => {
                    return {
                        'name': e.nombre,
                        'id': e.id
                    }
                })}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Departamento'
            />}
            <div className="col-12">
                <div className="row">
                    <MyCheckboxSimple
                        className="col-12 col-md-6"
                        label='Crear País'
                        name='nuevo_pais'
                    />
                    <MyCheckboxSimple
                        className="col-12 col-md-6"
                        label='Crear Departamento'
                        name='nuevo_departamento'
                    />
                </div>
            </div>
            {nuevo_pais &&
            <MyTextFieldSimple
                className="col-12"
                nombre='Nombre País'
                name='pais_nombre'
                case='U'/>}
            {(nuevo_pais || nuevo_departamento) &&
            <MyTextFieldSimple
                className="col-12"
                nombre='Nombre Departamento'
                name='departamento_nombre'
                case='U'/>}
            <MyTextFieldSimple
                className="col-12"
                nombre='Nombre Ciudad'
                name='ciudad_nombre'
                case='U'/>
        </MyFormTagModal>
    )
});

CrearUbicacionForm = reduxForm({
    form: "crearUbicacionForm",
    validate: validate,
    enableReinitialize: true
})(CrearUbicacionForm);

export default CrearUbicacionForm;