import React, {memo, useEffect, Fragment} from 'react';
import {formValueSelector} from 'redux-form';
import {reduxForm} from 'redux-form';
import Checkbox from '@material-ui/core/Checkbox';
import {MyCombobox, MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import {useDispatch, useSelector} from "react-redux";
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import * as actions from "../../../../01_actions/01_index";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const selector = formValueSelector('componenteForm');

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
        singular_name,
        clearFields,
    } = props;
    const valores = useSelector(state => selector(state, 'categoria', ''));
    const categoria_seleccionada = valores['categoria'] ? valores['categoria'] : 0;
    const categorias = useSelector(state => state.categorias_productos);
    const categorias_dos = useSelector(state => _.pickBy(state.banda_eurobelt_categorias_dos, e => e.categorias.includes(categoria_seleccionada)));
    const series = useSelector(state => state.banda_eurobelt_series);
    const materiales = useSelector(state => state.banda_eurobelt_materiales);
    const colores = useSelector(state => state.banda_eurobelt_colores);
    const tipos = useSelector(state => _.pickBy(state.banda_eurobelt_tipos, e => e.categorias.includes(categoria_seleccionada)));
    const dispatch = useDispatch();
    const series_compatibles = initialValues ? initialValues.series_compatibles : null;
    useEffect(() => {
        const cargarTipos = () => dispatch(actions.fetchBandaEurobeltTipos());
        const cargarColores = () => dispatch(actions.fetchBandaEurobeltColores({callback: cargarTipos}));
        const cargarSeries = () => dispatch(actions.fetchBandaEurobeltSeries({callback: cargarColores}));
        const cargarMateriales = () => dispatch(actions.fetchBandaEurobeltMateriales({callback: cargarSeries}));
        const cargarCategoriasDos = () => dispatch(actions.fetchBandaEurobeltCategorias({callback: cargarMateriales}));
        dispatch(actions.fetchCategoriasProductos({callback: cargarCategoriasDos}));
        return () => {
            dispatch(actions.clearCategoriasProductos());
            dispatch(actions.clearBandaEurobeltCategorias());
            dispatch(actions.clearBandaEurobeltSeries());
            dispatch(actions.clearBandaEurobeltMateriales());
            dispatch(actions.clearBandaEurobeltColores());
            dispatch(actions.clearBandaEurobeltTipos());
        }
    }, []);
    return (
        <MyFormTagModal
            onCancel={onCancel}
            fullScreen={true}
            onSubmit={handleSubmit((v) => onSubmit(v, null, null, false))}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <MyTextFieldSimple
                className="col-6 col-md-4"
                nombre='Referencia'
                name='referencia'
                case='U'
            />
            <MyTextFieldSimple
                className="col-6 col-md-4 pl-3"
                nombre='Descripción Adicional'
                name='descripcion_adicional'
                case='U'
            />
            <div className="col-12">
                <div className="row">
                    <MyCombobox
                        className="col-6 col-md-4"
                        name='categoria'
                        busy={false}
                        autoFocus={false}
                        onSelect={() => {
                            clearFields(false, false, 'categoria_dos');
                            clearFields(false, false, 'tipo_banda');
                        }}
                        data={_.map(_.orderBy(categorias, ['nombre'], ['asc']), e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        filter='contains'
                        valuesField='id'
                        placeholder='Categoría'
                    />
                    {
                        categoria_seleccionada !== 0 &&
                        <Fragment>
                            <MyCombobox
                                className="col-6 col-md-4"
                                name='categoria_dos'
                                busy={false}
                                autoFocus={false}
                                data={_.map(_.orderBy(categorias_dos, ['nombre'], ['asc']), e => {
                                    return {
                                        'name': e.nombre,
                                        'id': e.id
                                    }
                                })}
                                textField='name'
                                filter='contains'
                                valuesField='id'
                                placeholder='Categoria Dos'
                            />
                            <MyCombobox
                                className="col-6 col-md-4"
                                name='tipo_banda'
                                busy={false}
                                autoFocus={false}
                                data={_.map(_.orderBy(tipos, ['nombre'], ['asc']), e => {
                                    return {
                                        'name': e.nombre,
                                        'id': e.id
                                    }
                                })}
                                textField='name'
                                filter='contains'
                                valuesField='id'
                                placeholder='Tipo Banda'
                            />
                        </Fragment>
                    }
                    <MyCombobox
                        className="col-6 col-md-4"
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
                        className="col-6 col-md-4"
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
                        nombre='Ancho'
                        name='ancho'
                        type='number'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-3 pl-3"
                        nombre='Alto (mm)'
                        name='alto'
                        type='number'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-3 pl-3"
                        nombre='Diametro (mm)'
                        name='diametro'
                        type='number'/>
                    <MyTextFieldSimple
                        className="col-12 col-md-3 pl-3"
                        nombre='Costo'
                        name='costo'
                        type='number'/>
                </div>
            </div>
            {
                initialValues &&
                <div className='col-12'>
                    <Typography variant="h5" gutterBottom color="primary">
                        Series Compatibles
                    </Typography>
                    <div className="row">
                        {_.map(_.orderBy(series, ['nombre', 'asc']), s =>
                            <div
                                key={s.id}
                                className='col-12 col-md-3 col-lg-2'>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={series_compatibles.includes(s.id)}
                                            color='primary'
                                            onChange={(event, value) => dispatch(actions.adicionarQuitarSerieCompatibleComponente(initialValues.id, s.id))}
                                        />
                                    }
                                    label={s.nombre}
                                />
                            </div>)}
                    </div>
                </div>
            }
        </MyFormTagModal>
    )
});


Form = reduxForm({
    form: "componenteForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;