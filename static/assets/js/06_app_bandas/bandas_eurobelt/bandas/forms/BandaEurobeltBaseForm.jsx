import React, {memo, useEffect} from 'react';
import {reduxForm, formValueSelector} from 'redux-form';
import * as actions from '../../../../01_actions/01_index';
import {useDispatch, useSelector} from 'react-redux';
import Divider from '@material-ui/core/Divider';
import {MyCombobox, MyTextFieldSimple, MyCheckboxSimple} from '../../../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import Typography from "@material-ui/core/Typography";
import BotoneriaModalForm from "../../../../00_utilities/components/ui/forms/botoneria_modal_form";

const selector = formValueSelector('bandaEurobeltForm');

let Form = memo(props => {
    const dispatch = useDispatch();
    const valores = useSelector(state => selector(state, 'serie', 'con_aleta', 'con_empujador', 'empujador_tipo', 'largo'));
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel = null,
        handleSubmit,
        mostrar_cancelar
    } = props;
    const series = useSelector(state => state.banda_eurobelt_series);
    const materiales = useSelector(state => state.banda_eurobelt_materiales);
    const colores = useSelector(state => state.banda_eurobelt_colores);
    const tipos = useSelector(state => state.banda_eurobelt_tipos);
    const configuracion = useSelector(state => _.map(state.banda_eurobelt_configuracion)[0]);
    const con_aleta = valores['con_aleta'] ? valores['con_aleta'] : false;
    const con_empujador = valores['con_empujador'] ? valores['con_empujador'] : false;
    const id_categoria_banda = configuracion ? configuracion.categoria_banda : null;
    const id_categoria_empujador = configuracion ? configuracion.categoria_empujador : null;

    const tipos_bandas = id_categoria_banda ? _.pickBy(tipos, t => t.categorias.includes(id_categoria_banda)) : {};
    const tipos_empujadores = id_categoria_empujador ? _.pickBy(tipos, t => t.categorias.includes(id_categoria_empujador)) : {};
    useEffect(() => {
        const cargarTipos = () => dispatch(actions.fetchBandaEurobeltTipos());
        const cargarMateriales = () => dispatch(actions.fetchBandaEurobeltMateriales({callback: cargarTipos}));
        const cargarColores = () => dispatch(actions.fetchBandaEurobeltColores({callback: cargarMateriales}));
        const cargarConfiguracion = () => dispatch(actions.fetchConfiguracionBandaEurobelt({callback: cargarColores}));
        dispatch(actions.fetchBandaEurobeltSeries({callback: cargarConfiguracion}));
        return () => {
            dispatch(actions.clearBandaEurobeltCategorias());
            dispatch(actions.clearBandaEurobeltSeries());
            dispatch(actions.clearBandaEurobeltMateriales());
            dispatch(actions.clearBandaEurobeltColores());
            dispatch(actions.clearBandaEurobeltTipos());
            dispatch(actions.clearConfiguracionBandaEurobelt());
        }
    }, []);
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="col-12">
                <div className="row">
                    <MyCombobox
                        label_space_xs={4}
                        label='Serie'
                        className="col-6 col-md-4 col-lg-3"
                        name='serie'
                        busy={false}
                        autoFocus={false}
                        data={_.map(_.orderBy(series, ['nombre'], ['asc']), e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        filter='contains'
                        valuesField='id'
                        placeholder='Serie'
                    />
                    <MyCombobox
                        label_space_xs={4}
                        label='Tipo'
                        className="col-6 col-md-4 col-lg-3"
                        name='tipo'
                        busy={false}
                        autoFocus={false}
                        data={_.map(_.orderBy(tipos_bandas, ['nombre'], ['asc']), e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        filter='contains'
                        valuesField='id'
                        placeholder='Tipo'
                    />
                    <MyCombobox
                        label_space_xs={4}
                        label='Material'
                        className="col-6 col-md-4 col-lg-3"
                        name='material'
                        busy={false}
                        autoFocus={false}
                        data={_.map(_.orderBy(materiales, ['nombre'], ['asc']), e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        filter='contains'
                        valuesField='id'
                        placeholder='Material'
                    />
                    <MyCombobox
                        label_space_xs={4}
                        label='Color'
                        className="col-6 col-md-4 col-lg-3"
                        name='color'
                        busy={false}
                        autoFocus={false}
                        data={_.map(_.orderBy(colores, ['nombre'], ['asc']), e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        filter='contains'
                        valuesField='id'
                        placeholder='Color'
                    />
                </div>
            </div>
            <div className="col-12">
                <div className="row">
                    <MyTextFieldSimple
                        className="col-12 col-md-3 pl-3"
                        nombre='Largo (mm)'
                        name='largo'
                        type='number'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-3 pl-3"
                        nombre='Ancho (mm)'
                        name='ancho'
                        type='number'/>
                    <MyCheckboxSimple
                        className="col-12 col-md-6"
                        label='Tiene Empujador'
                        name='con_empujador'/>
                    <MyCheckboxSimple
                        className="col-12 col-md-6"
                        label='Tiene Aleta'
                        name='con_aleta'/>
                    <MyCheckboxSimple
                        className="col-12 col-md-6"
                        label='Tiene Torneado Varilla'
                        name='con_torneado_varilla'/>
                </div>
            </div>
            {con_empujador &&
            <div className="col-12 m-2">
                <Divider variant="fullWidth"/>
                <div className="row">
                    <Typography variant="h6" color="primary" noWrap>
                        Empujador
                    </Typography>
                    <div className="col-12">
                        <div className="row">
                            <MyCombobox
                                label_space_xs={4}
                                label='Tipo Empujador'
                                className="col-6 col-md-4"
                                name='empujador_tipo'
                                busy={false}
                                autoFocus={false}
                                data={_.map(_.orderBy(tipos_empujadores, ['nombre'], ['asc']), e => {
                                    return {
                                        'name': e.nombre,
                                        'id': e.id
                                    }
                                })}
                                textField='name'
                                filter='contains'
                                valuesField='id'
                                placeholder='Tipo Empujador'
                            />
                        </div>
                    </div>
                    <MyTextFieldSimple
                        className="col-12 col-md-3 col-lg-2 pl-3"
                        nombre='Alto (mm)'
                        name='empujador_alto'
                        type='number'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-3 col-lg-2 pl-3"
                        nombre='Ancho (mm)'
                        name='empujador_ancho'
                        type='number'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-3 col-lg-2 pl-3"
                        nombre='Distanciado'
                        name='empujador_distanciado'
                        type='number'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-3 col-lg-2 pl-3"
                        nombre='Filas Entre Empujadores'
                        name='empujador_filas_entre_empujador'
                        type='number'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-3 col-lg-2 pl-3"
                        nombre='Filas Empujador'
                        name='empujador_filas_empujador'
                        type='number'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-3 col-lg-2 pl-3"
                        nombre='Identación'
                        name='empujador_identacion'
                        type='number'/>
                </div>
            </div>}
            {con_aleta &&
            <div className="col-12 m-2">
                <Divider variant="fullWidth"/>
                <div className="row">
                    <Typography variant="h6" color="primary" noWrap>
                        Aleta
                    </Typography>
                    <MyTextFieldSimple
                        className="col-12 col-md-2 pl-3"
                        nombre='Alto (mm)'
                        name='aleta_alto'
                        type='number'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-2 pl-3"
                        nombre='Identación'
                        name='aleta_identacion'
                        type='number'/>
                </div>
            </div>}
            <div className='p-3'>
                <BotoneriaModalForm
                    mostrar_submit={true}
                    mostrar_limpiar={true}
                    mostrar_cancelar={mostrar_cancelar}
                    onCancel={onCancel}
                    pristine={pristine}
                    reset={reset}
                    submitting={submitting}
                    initialValues={initialValues}
                />
            </div>

        </form>
    )
});

Form = reduxForm({
    form: "bandaEurobeltForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;