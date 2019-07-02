import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from "react-redux";
import validate from './validate';
import FormBaseCotizacion from '../forms/base_cotizacion_form';
import BotoneriaModalForm from '../../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import {MyCombobox} from '../../../../../00_utilities/components/ui/forms/fields';
import {formValueSelector} from 'redux-form';

const selector = formValueSelector('cotizacionEditForm');

class Form extends Component {
    constructor(props) {
        super(props);
        this.cargarContactosCliente = this.cargarContactosCliente.bind(this);
    }

    componentWillUnmount() {
        this.props.clearClientes();
        this.props.clearContactosClientes();
    }

    cargarContactosCliente(cliente_id) {
        this.props.fetchContactosClientes_por_cliente(cliente_id);
    }

    componentDidMount() {
        const {initialValues} = this.props;

        const cargarResponsable = () => {
            if (initialValues.responsable) {
                this.props.fetchUsuario(initialValues.responsable)
            }
        };

        let cargarContactos = cargarResponsable;
        if (initialValues) {
            const {cliente} = initialValues;
            cargarContactos = () => this.props.fetchContactosClientes_por_cliente(cliente, {callback: cargarResponsable});
        }
        const cargarClientes = () => this.props.fetchClientes({callback: cargarContactos});
        this.props.fetchUsuariosxPermiso('gestionar_cotizacion', {callback: cargarClientes});
    }

    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            onSubmit,
            handleSubmit,
            onCancel,
            usuarios_list,
            clientes_list,
            contactos_list,
            myValues
        } = this.props;
        return (
            <form className="card" onSubmit={handleSubmit(onSubmit)}>
                <div className="row pl-3 pr-5">
                    <FormBaseCotizacion
                        contactos_list={contactos_list}
                        cargarContactosCliente={this.cargarContactosCliente}
                        clientes_list={clientes_list}
                        item={initialValues}
                        myValues={myValues}
                    />
                    {
                        _.size(usuarios_list) > 0 &&
                        <MyCombobox
                            data={_.map(usuarios_list, u => {
                                return (
                                    {
                                        name: `${u.first_name} ${u.last_name}`,
                                        id: u.id
                                    }
                                )
                            })}
                            name='responsable'
                            textField='name'
                            valuesField='id'
                            className='col-12'
                            placeholder='Responsable'
                            filter='contains'
                        />
                    }
                </div>
                <BotoneriaModalForm
                    conCerrar={false}
                    onCancel={onCancel}
                    pristine={pristine}
                    reset={reset}
                    submitting={submitting}
                    initialValues={initialValues}
                />
            </form>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        myValues: selector(state, 'estado', 'valor_ofertado', 'cliente')
    }
}

Form = reduxForm({
    form: "cotizacionEditForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;