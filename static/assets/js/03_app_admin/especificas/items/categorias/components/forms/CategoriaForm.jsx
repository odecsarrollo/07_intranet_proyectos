import React, {Component, Fragment} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Combobox from "react-widgets/lib/Combobox";
import Button from "@material-ui/core/Button";

const CategoriasDosTable = (props) => {
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
};

const TiposTable = (props) => {
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
};

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoria_dos_id: null,
            tipos_id: null
        };
        this.adicionarTiposBandas = this.adicionarTiposBandas.bind(this);
        this.quitarTiposBandas = this.quitarTiposBandas.bind(this);
        this.adicionarCategoriaDosBandas = this.adicionarCategoriaDosBandas.bind(this);
        this.quitarCategoriaDosBandas = this.quitarCategoriaDosBandas.bind(this);
    }

    adicionarCategoriaDosBandas() {
        const {categoria_dos_id} = this.state;
        const {initialValues} = this.props;
        return this.props.adicionarQuitarCategoriaDosCategoriaProducto(initialValues.id, categoria_dos_id)
    }

    quitarCategoriaDosBandas(categoria_producto_id) {
        const {initialValues} = this.props;
        return this.props.adicionarQuitarCategoriaDosCategoriaProducto(initialValues.id, categoria_producto_id)
    }

    adicionarTiposBandas() {
        const {tipos_id} = this.state;
        const {initialValues} = this.props;
        return this.props.adicionarQuitarTipoBandaCategoriaProducto(initialValues.id, tipos_id)
    }

    quitarTiposBandas(tipos_id) {
        const {initialValues} = this.props;
        return this.props.adicionarQuitarTipoBandaCategoriaProducto(initialValues.id, tipos_id)
    }

    render() {
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
            categorias_dos,
            tipos
        } = this.props;
        const {tipos_id, categoria_dos_id} = this.state;
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
                            onSelect={e => {
                                this.setState({tipos_id: e.id});
                            }}
                        />
                        {
                            tipos_id &&
                            <Button
                                onClick={() => this.adicionarTiposBandas()}
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
                                    onDelete={id => this.quitarTiposBandas(id)}
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
                            onSelect={e => {
                                this.setState({categoria_dos_id: e.id});
                            }}
                        />
                        {
                            categoria_dos_id &&
                            <Button
                                onClick={() => this.adicionarCategoriaDosBandas()}
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
                                    onDelete={id => this.quitarCategoriaDosBandas(id)}
                                />
                            </div>
                        }
                    </Fragment>
                }
            </MyFormTagModal>
        )
    }
}


function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado
    }
}

Form = reduxForm({
    form: "categoriasProductosForm",
    validate,
    enableReinitialize: true
})(Form);

export default (connect(mapPropsToState, null)(Form));