import React, {Fragment, memo, useEffect, useState} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {useDispatch, useSelector} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Combobox from "react-widgets/lib/Combobox";
import Button from "@material-ui/core/Button";
import * as actions from "../../../../../01_actions/01_index";

const CategoriasDosTable = memo(props => {
    const {categorias_dos, onDelete} = props;
    return (
        <ul>
            {categorias_dos.map(e => {
                    return (
                        <li key={e.id}>
                            {e.nombre}
                            <FontAwesomeIcon
                                className='puntero ml-4'
                                onClick={() => onDelete(e.id)}
                                icon={'minus-circle'}
                            />
                        </li>
                    )
                }
            )
            }
        </ul>
    )
});

const TiposTable = memo(props => {
    const {tipos_bandas, onDelete} = props;
    return (
        <ul>
            {tipos_bandas.map(e => {
                    return (
                        <li key={e.id}>
                            {e.nombre}
                            <FontAwesomeIcon
                                className='puntero ml-4'
                                onClick={() => onDelete(e.id)}
                                icon={'minus-circle'}
                            />
                        </li>
                    )
                }
            )
            }
        </ul>
    )
});
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
        singular_name

    } = props;
    const [categoria_dos_id, setCategoriaDosId] = useState(null);
    const [tipos_id, setTiposId] = useState(null);

    const categorias_dos = useSelector(state => state.banda_eurobelt_categorias_dos);
    const tipos = useSelector(state => state.banda_eurobelt_tipos);
    useEffect(() => {
        const cargarCategoriasDos = () => dispatch(actions.fetchBandaEurobeltCategorias());
        dispatch(actions.fetchBandaEurobeltTipos({callback: cargarCategoriasDos}));
        return () => {
            dispatch(actions.clearBandaEurobeltCategorias());
            dispatch(actions.clearBandaEurobeltTipos());
        }
    }, []);

    const adicionarCategoriaDosBandas = () => dispatch(actions.adicionarQuitarCategoriaDosCategoriaProducto(initialValues.id, categoria_dos_id));
    const quitarCategoriaDosBandas = (categoria_producto_id) => dispatch(actions.adicionarQuitarCategoriaDosCategoriaProducto(initialValues.id, categoria_producto_id));
    const adicionarTiposBandas = () => dispatch(actions.adicionarQuitarTipoBandaCategoriaProducto(initialValues.id, tipos_id));
    const quitarTiposBandas = (tipos_id) => dispatch(actions.adicionarQuitarTipoBandaCategoriaProducto(initialValues.id, tipos_id));
    return (
        <MyFormTagModal
            onCancel={onCancel}
            fullScreen={true}
            onSubmit={handleSubmit(onSubmit)}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            <MyTextFieldSimple
                className="col-12 col-md-9"
                nombre='Nombre'
                name='nombre'
                case='U'/>
            <MyTextFieldSimple
                className="col-12  col-md-3"
                nombre='Nomenclatura'
                name='nomenclatura'
                case='U'/>
            {
                initialValues &&
                <Fragment>
                    <Combobox
                        className="col-9"
                        data={_.map(tipos)}
                        filter='contains'
                        placeholder='Seleccionar Tipo'
                        valueField='id'
                        textField='nombre'
                        onSelect={e => setTiposId(e.id)}
                    />
                    {
                        tipos_id &&
                        <Button
                            onClick={() => adicionarTiposBandas()}
                            color={
                                !initialValues.tipos_eurobelt.map(e => e.id).includes(tipos_id) ?
                                    'primary' :
                                    'secondary'
                            }
                            variant="outlined"
                        >
                            {
                                !initialValues.tipos_eurobelt.map(e => e.id).includes(tipos_id) ?
                                    'Adicionar' :
                                    'Eliminar'
                            }
                        </Button>
                    }
                    {
                        initialValues.tipos_eurobelt.length > 0 &&
                        <div className="col-12">
                            <TiposTable
                                tipos_bandas={initialValues.tipos_eurobelt}
                                onDelete={id => quitarTiposBandas(id)}
                            />
                        </div>
                    }
                </Fragment>
            }
            {
                initialValues &&
                <Fragment>
                    <Combobox
                        className="col-9"
                        data={_.map(categorias_dos)}
                        filter='contains'
                        placeholder='Seleccionar Categoría Dos'
                        valueField='id'
                        textField='nombre'
                        onSelect={e => setCategoriaDosId(e.id)}
                    />
                    {
                        categoria_dos_id &&
                        <Button
                            onClick={() => adicionarCategoriaDosBandas()}
                            color={
                                !initialValues.categorias_dos_eurobelt.map(e => e.id).includes(categoria_dos_id) ?
                                    'primary' :
                                    'secondary'
                            }
                            variant="outlined"
                        >
                            {
                                !initialValues.categorias_dos_eurobelt.map(e => e.id).includes(categoria_dos_id) ?
                                    'Adicionar' :
                                    'Eliminar'
                            }
                        </Button>
                    }
                    {
                        initialValues.categorias_dos_eurobelt.length > 0 &&
                        <div className="col-12">
                            <CategoriasDosTable
                                categorias_dos={initialValues.categorias_dos_eurobelt}
                                onDelete={id => quitarCategoriaDosBandas(id)}
                            />
                        </div>
                    }
                </Fragment>
            }
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "categoriasProductosForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;