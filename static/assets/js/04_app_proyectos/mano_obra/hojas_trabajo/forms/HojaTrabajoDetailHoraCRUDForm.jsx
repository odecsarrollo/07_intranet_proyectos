import React, {Fragment, memo, useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyCombobox,
    MyTextFieldSimple,
} from '../../../../00_utilities/components/ui/forms/fields';
import {useDispatch, useSelector} from "react-redux";
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate_horas';
import * as actions from '../../../../01_actions/01_index';

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
        hoja_trabajo,
    } = props;

    const proyectos_list = useSelector(state => state.proyectos);
    const literales_list = useSelector(state => state.literales);

    const mi_cuenta = JSON.parse(localStorage.getItem('mi_cuenta'));
    const autogestion_horas_trabajadas = !!(
        mi_cuenta.colaborador &&
        mi_cuenta.colaborador.autogestion_horas_trabajadas
    );

    const verificado = initialValues ? initialValues.verificado : false;

    let proyectos_list_array = _.map(_.sortBy(proyectos_list, ['id_proyecto'], ['asc']), e => e);

    let proyecto_literales = null;
    if (literales_list) {
        proyecto_literales =
            _.map(_.pickBy(literales_list, li => {
                return (
                    (
                        !_.map(hoja_trabajo.mis_horas_trabajadas, e => e.literal).includes(li.id)
                        || (initialValues && li.id === initialValues.literal)
                    ) &&
                    li.abierto
                )
            }), e => {
                return ({
                    id: e.id,
                    descripcion: `${e.id_literal} - ${e.descripcion}`
                })
            });
    }
    const cargarDatos = () => {
        if (initialValues) {
            const {proyecto} = initialValues;
            dispatch(actions.fetchProyecto(proyecto, {callback: () => dispatch(actions.fetchLiteralesXProyecto(proyecto))}));
        }
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearLiterales());
        }
    }, [initialValues]);

    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit((e) => {
                const verificado = !autogestion_horas_trabajadas;
                const autogestionada = autogestion_horas_trabajadas;
                const cantidad_minutos = (Number(e.horas * 60) + Number(e.minutos));
                onSubmit({...e, hoja: hoja_trabajo.id, cantidad_minutos, autogestionada, verificado});
            })}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            {
                !verificado ?
                    <Fragment>
                        <MyCombobox
                            data={proyectos_list_array}
                            className='col-12'
                            valuesField='id'
                            textField='id_proyecto'
                            autoFocus={true}
                            onSelect={(e) => {
                                dispatch(actions.fetchLiteralesXProyecto(e.id));
                            }}
                            name='proyecto'
                            onChange={v => v.id}
                            placeholder='Proyecto'
                            caseSensitive={false}
                            minLength={3}
                            filter='contains'
                        />
                        {
                            literales_list &&
                            <Fragment>
                                <MyCombobox
                                    data={_.orderBy(proyecto_literales, ['descripcion'], ['asc'])}
                                    className='col-12'
                                    valuesField='id'
                                    textField='descripcion'
                                    autoFocus={true}
                                    name='literal'
                                    placeholder='Literales'
                                    caseSensitive={false}
                                    minLength={3}
                                    filter='contains'
                                />
                                <div className='col-12'>
                                    <div className="row">
                                        <MyTextFieldSimple
                                            disabled={verificado}
                                            name='horas'
                                            nombre='Horas'
                                            className='col-6'
                                        />
                                        <MyTextFieldSimple
                                            disabled={verificado}
                                            name='minutos'
                                            nombre='Minutos'
                                            className='col-6'
                                        />
                                    </div>
                                </div>
                                <MyTextFieldSimple
                                    name='descripcion_tarea'
                                    nombre='Descripción'
                                    rows={5}
                                    multiline={true}
                                    className='col-12'
                                    disabled={!autogestion_horas_trabajadas || verificado}
                                />
                            </Fragment>
                        }
                        <div style={{height: '300px'}}>

                        </div>
                    </Fragment> :
                    <span>Esta verificado, no se puede cambiar</span>
            }
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "horaHojaTrabajoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;