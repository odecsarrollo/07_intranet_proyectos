import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import BaseForm from './base_form';


class Form extends Component {
    componentDidMount() {
        this.props.fetchClientes();
    }

    componentWillUnmount() {
        this.props.clearClientes();
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
            permisos_object,
            clientes_list,
        } = this.props;
        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit(onSubmit)}
                reset={reset}
                initialValues={null}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <div className="m-2">
                    <BaseForm
                        clientes_list={clientes_list}
                        permisos_object={permisos_object}
                        initialValues={initialValues}
                    />
                </div>
            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    const item = {
        costo_presupuestado: item_seleccionado.costo_presupuestado,
        valor_cliente: item_seleccionado.valor_orden_compra,
        cotizacion: item_seleccionado.id,
        abierto: true,
        cotizacion_nro:`${item_seleccionado.unidad_negocio}-${item_seleccionado.nro_cotizacion}`,
        en_cguno: 0,
        nombre: item_seleccionado.descripcion_cotizacion,
        cliente: null,
    };
    return {
        initialValues: item
    }
}

Form = reduxForm({
    form: "proyectoFromCotizacionForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;