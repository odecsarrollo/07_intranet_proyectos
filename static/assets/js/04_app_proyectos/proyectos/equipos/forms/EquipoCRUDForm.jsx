import React, {memo, useEffect} from 'react';
import {formValueSelector, reduxForm} from 'redux-form';
import {useDispatch, useSelector} from "react-redux";
import {MyTextFieldSimple, MyCombobox} from '../../../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import * as actions from '../../../../01_actions/01_index';

const selector = formValueSelector('equipoCRUDForm');

const CustomCampo = ({campo, origen}) => {
    return <MyTextFieldSimple
        className={`col-12 col-md-${campo.tamano_columna ? campo.tamano_columna : '12'}`}
        nombre={campo.label}
        placeholder={campo.label}
        name={`campo${origen}_${campo.id}`}
        case='U'/>
};

let EquipoCRUDForm = memo(props => {
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
    const myValues = useSelector(state => selector(state, 'tipo_equipo', 'tipo_equipo_clase'));
    const tipos_equipos = useSelector(state => state.tipos_equipos);
    useEffect(() => {
        dispatch(actions.fetchTIposEquiposParaCrearEquipos());
        return () => dispatch(actions.clearTIposEquipos());
    }, []);
    let campos = []
    let tipos_equipos_choices = _.map(tipos_equipos, t => ({name: `${t.sigla}-${t.nombre}`, id: t.id}));
    const tipos_equipos_clase = myValues.tipo_equipo ? _.mapKeys(tipos_equipos[myValues.tipo_equipo].clases_tipo_equipo, 'id') : {};
    let tipos_equipos_clase_choices = _.map(tipos_equipos_clase, t => ({name: `${t.sigla}-${t.nombre}`, id: t.id}));
    const campos_tipo_equipo = myValues.tipo_equipo ? tipos_equipos[myValues.tipo_equipo].campos : [];
    const campos_tipo_equipo_clase = myValues.tipo_equipo && myValues.tipo_equipo_clase ? _.mapKeys(tipos_equipos[myValues.tipo_equipo].clases_tipo_equipo, 'id')[myValues.tipo_equipo_clase].campos : [];
    campos = [...campos_tipo_equipo, ...campos_tipo_equipo_clase];

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
                nombre='Nombre'
                name='nombre'
                case='U'/>
            <MyCombobox
                label_space_xs={3}
                className='col-12 col-md-6'
                name='tipo_equipo'
                label='Tipo'
                busy={false}
                autoFocus={false}
                data={tipos_equipos_choices}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Seleccionar Tipo Equipo...'
            />
            {myValues.tipo_equipo && <MyCombobox
                label_space_xs={3}
                className='col-12 col-md-6'
                name='tipo_equipo_clase'
                label='Clase'
                busy={false}
                autoFocus={false}
                data={tipos_equipos_clase_choices}
                textField='name'
                filter='contains'
                valuesField='id'
                placeholder='Seleccionar Clase Equipo...'
            />}
            {campos && campos.map(c => <CustomCampo campo={c} key={c.id} origen={'TP'}/>)}
        </MyFormTagModal>
    )
});

EquipoCRUDForm = reduxForm({
    form: "equipoCRUDForm",
    validate: validate,
    enableReinitialize: true
})(EquipoCRUDForm);

export default EquipoCRUDForm;