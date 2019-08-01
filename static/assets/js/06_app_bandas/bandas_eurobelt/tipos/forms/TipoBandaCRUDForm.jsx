import React, {useEffect, Fragment, memo, useState} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import {useSelector, useDispatch} from "react-redux";
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import Button from "@material-ui/core/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Combobox from 'react-widgets/lib/Combobox';
import * as actions from '../../../../01_actions/01_index';

const styles = {
    table: {
        fontSize: '0.8rem',
        td: {
            padding: '0',
            margin: '0',
            paddingLeft: '3px',
            paddingRight: '3px',
            border: '1px solid black'
        },
        td_right: {
            padding: '0',
            margin: '0',
            paddingRight: '3px',
            paddingLeft: '3px',
            textAlign: 'right',
            border: '1px solid black'
        },
        td_total: {
            padding: '0',
            margin: '0',
            paddingRight: '3px',
            paddingLeft: '3px',
            textAlign: 'right',
            borderBottom: 'double 3px'
        },
        tr: {
            padding: '0',
            margin: '0',
        }
    },
};

const CategoriasTable = (props) => {
    const {categorias, onDelete} = props;
    return (
        <table className='table table-striped' style={styles.table}>
            <thead>
            <tr style={styles.table.tr}>
                <th style={styles.table.td}>Nombre Categoria</th>
                <th style={styles.table.td}></th>
            </tr>
            </thead>
            <tbody>
            {
                categorias.map(e => {
                        return (
                            <tr style={styles.table.tr} key={e.id}>
                                <td style={styles.table.td}>{e.nombre}</td>
                                <td style={styles.table.td}>
                                    <FontAwesomeIcon
                                        className='puntero'
                                        onClick={() => onDelete(e.id)}
                                        icon={'minus-circle'}
                                    />
                                </td>
                            </tr>
                        )
                    }
                )
            }
            </tbody>
        </table>
    )
};

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
    } = props;
    const [categoria_seleccionado_id, setCategoriaSeleccionada] = useState(null);
    const categorias = useSelector(state => state.categorias_productos);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.fetchCategoriasProductos());
        return () => dispatch(actions.clearCategoriasProductos())
    }, []);

    const adicionarCategoriaProducto = () => {
        return dispatch(actions.adicionarQuitarCategoriaProductoBandaEurobeltTipo(initialValues.id, categoria_seleccionado_id))
    };

    const quitarCategoriaProducto = (categoria_producto_id) => {
        return dispatch(actions.adicionarQuitarCategoriaProductoBandaEurobeltTipo(initialValues.id, categoria_producto_id))
    };

    return (
        <MyFormTagModal
            onCancel={onCancel}
            fullScreen={false}
            onSubmit={handleSubmit(v => onSubmit(v, null, null, false))}
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
                        data={_.map(categorias)}
                        filter='contains'
                        placeholder='Buscar Categoría'
                        valueField='id'
                        textField='nombre'
                        onSelect={e => setCategoriaSeleccionada(e.id)}
                    />
                    <Button
                        onClick={() => adicionarCategoriaProducto()}
                        color={
                            !initialValues.categorias.map(e => e.id).includes(categoria_seleccionado_id) ?
                                'primary' :
                                'secondary'
                        }
                        variant="outlined"
                    >
                        {
                            !initialValues.categorias.map(e => e.id).includes(categoria_seleccionado_id) ?
                                'Adicionar' :
                                'Eliminar'
                        }
                    </Button>
                    <div className="col-12 mt-2">
                        <CategoriasTable
                            categorias={initialValues.categorias}
                            onDelete={id => quitarCategoriaProducto(id)}
                        />
                    </div>
                </Fragment>
            }
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "tiposBandasEurobelForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;