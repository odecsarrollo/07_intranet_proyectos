import React, {useEffect, memo} from 'react';
import {reduxForm} from 'redux-form';
import * as actions from '../../../../01_actions/01_index';
import {
    MyCombobox,
    MyDateTimePickerField
} from '../../../../00_utilities/components/ui/forms/fields';
import {useSelector, useDispatch} from "react-redux";
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate_hoja';
import moment from "moment-timezone";
import {fechaToYMD} from "../../../../00_utilities/common";

let Form = memo(props => {
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
        permisos_object,
    } = props;
    const configuracion_costos = useSelector(state => _.map(state.configuracion_costos, c => c)[0]);
    const colaboradores_list = useSelector(state => state.colaboradores);
    useEffect(() => {
        const cargarConfigCostos = () => dispatch(actions.fetchConfiguracionesCostos());
        dispatch(actions.fetchColaboradoresEnProyectos({callback: cargarConfigCostos}));
        return () => {
            dispatch(actions.clearColaboradores());
        };
    }, []);
    const mi_cuenta = JSON.parse(localStorage.getItem('mi_cuenta'));
    let fecha_cierre_costos = new Date(1900, 0, 1);

    if (configuracion_costos) {
        const cierre_costos = moment(configuracion_costos.fecha_cierre).tz('America/Bogota').toDate();
        fecha_cierre_costos = new Date(cierre_costos.getFullYear(), cierre_costos.getMonth(), cierre_costos.getDate())
    }
    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit((v) => {
                const fecha = fechaToYMD(v.fecha);
                if (!permisos_object.add_para_otros) {
                    if (mi_cuenta.colaborador) {
                        onSubmit({...v, colaborador: mi_cuenta.colaborador.id, fecha})
                    }
                } else {
                    onSubmit({...v, fecha})
                }
            })}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            {
                permisos_object.add_para_otros &&
                <MyCombobox
                    data={_.map(_.pickBy(_.orderBy(colaboradores_list, ['nombres'], ['asc']), a => {
                        return (
                            a.autogestion_horas_trabajadas === false ||
                            a.usuario === mi_cuenta.id
                        )
                    }), e => {
                        return (
                            {
                                id: e.id,
                                nombre: `${e.nombres} ${e.apellidos}`
                            }
                        )
                    })}
                    className='col-12'
                    valuesField='id'
                    textField='nombre'
                    autoFocus={true}
                    name='colaborador'
                    placeholder='Colaborador'
                    filter='contains'
                />
            }
            <MyDateTimePickerField
                min={fecha_cierre_costos}
                className='col-12 mb-5'
                name='fecha'
                label='Fecha'
                label_space_xs={4}
                dropUp={false}
            />
            <div style={{height: '300px'}}>

            </div>
        </MyFormTagModal>
    )

});

Form = reduxForm({
    form: "hojaTrabajoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;