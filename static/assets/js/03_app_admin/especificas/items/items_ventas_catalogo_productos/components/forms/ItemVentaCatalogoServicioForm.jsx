import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyCheckboxSimple,
    MyCombobox
} from '../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


class Form extends Component {
    componentDidMount() {
        const cargarProveedores = () => this.props.fetchProveedoresImportaciones();
        this.props.fetchMargenesProvedores({callback: cargarProveedores});
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
            proveedores_importaciones,
            margenes_proveedores
        } = this.props;
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
                    className="col-12 col-md-9 col-lg-6"
                    nombre='Nombre'
                    name='nombre_catalogo'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12 col-md-3 col-lg-3"
                    nombre='Referencia'
                    name='referencia_catalogo'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12 col-md-3 col-lg-3"
                    nombre='U.M'
                    name='unidad_medida_catalogo'
                    case='U'/>
                <MyTextFieldSimple
                    className="col-12 col-md-3 col-lg-3"
                    nombre='Costo'
                    name='costo_catalogo'
                    case='U'/>
                <MyCheckboxSimple
                    className='col-12 col-md-3'
                    nombre='Activo'
                    name='activo'
                />
                <MyCombobox
                    data={_.map(proveedores_importaciones, u => {
                        return (
                            {
                                name: `${u.to_string}`,
                                id: u.id
                            }
                        )
                    })}
                    name='proveedor_importacion'
                    textField='name'
                    valuesField='id'
                    className='col-12 col-md-6 col-lg-4'
                    placeholder='Proveedor'
                    filter='contains'
                />
                <MyCombobox
                    data={_.map(margenes_proveedores, u => {
                        return (
                            {
                                name: `${u.to_string}`,
                                id: u.id
                            }
                        )
                    })}
                    name='margen'
                    textField='name'
                    valuesField='id'
                    className='col-12 col-md-6 col-lg-4'
                    placeholder='Margen'
                    filter='contains'
                />
                {
                    initialValues &&
                    <div className="col-12">
                        Procedencia: {initialValues.origen}
                    </div>
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
    form: "itemVentaCatalogoForm",
    validate,
    enableReinitialize: true
})(Form);

export default (connect(mapPropsToState, null)(Form));