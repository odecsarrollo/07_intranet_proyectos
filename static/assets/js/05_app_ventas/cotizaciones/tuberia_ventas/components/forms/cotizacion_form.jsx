import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import FormBaseCotizacion from '../forms/base_cotizacion_form';
import {formValueSelector} from 'redux-form';

const selector = formValueSelector('cotizacionForm');

class Form extends Component {

    constructor(props) {
        super(props);
        this.cargarContactosCliente = this.cargarContactosCliente.bind(this);
    }

    componentDidMount() {
        const {
            noCargando,
            cargando,
            notificarErrorAjaxAction,
            fetchClientes,
            initialValues,
            fetchContactosClientes_por_cliente,
        } = this.props;
        cargando();
        let cargarContactos = () => noCargando();
        if (initialValues) {
            const {cliente} = initialValues;
            cargarContactos = () => fetchContactosClientes_por_cliente(
                cliente,
                () => noCargando(),
                notificarErrorAjaxAction
            );
        }
        fetchClientes(cargarContactos, notificarErrorAjaxAction);
    }

    componentWillUnmount() {
        this.props.clearClientes();
        this.props.clearContactosClientes();
    }

    cargarContactosCliente(cliente_id) {
        const {
            noCargando,
            cargando,
            notificarErrorAjaxAction,
            fetchContactosClientes_por_cliente,
        } = this.props;
        cargando();
        fetchContactosClientes_por_cliente(
            cliente_id,
            () => noCargando(),
            notificarErrorAjaxAction
        );
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
            clientes_list,
            contactos_list,
            myValues,
        } = this.props;
        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit(onSubmit)}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <FormBaseCotizacion
                    cargarContactosCliente={this.cargarContactosCliente}
                    item={initialValues}
                    myValues={myValues}
                    contactos_list={contactos_list}
                    clientes_list={clientes_list}
                />
                <div style={{height: '300px'}}>

                </div>
            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        myValues: selector(state, 'estado', 'valor_ofertado', 'cliente'),
        initialValues: item_seleccionado,
    }
}

Form = reduxForm({
    form: "cotizacionForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;