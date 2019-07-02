import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import BaseForm from './base_form';


class Form extends Component {
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
    const {initialValues} = ownProps;
    const item = {
        costo_presupuestado: initialValues.costo_presupuestado,
        orden_compra_fecha: initialValues.orden_compra_fecha,
        fecha_entrega_pactada: initialValues.fecha_entrega_pactada,
        valor_cliente: initialValues.valor_orden_compra,
        cotizacion: initialValues.id,
        abierto: true,
        cotizacion_nro:`${initialValues.unidad_negocio}-${initialValues.nro_cotizacion}`,
        en_cguno: 0,
        nombre: initialValues.descripcion_cotizacion,
        cliente_nombre: initialValues.cliente_nombre,
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