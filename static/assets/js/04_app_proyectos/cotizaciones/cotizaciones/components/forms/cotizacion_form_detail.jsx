import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from "react-redux";
import validate from './validate';
import FormBaseCotizacion from '../forms/base_cotizacion_form';
import BotoneriaModalForm from '../../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import {MyCombobox, MyDropdownList} from '../../../../../00_utilities/components/ui/forms/fields';
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

    componentDidMount() {
        const {
            noCargando,
            cargando,
            notificarErrorAjaxAction,
            item_seleccionado,
            initialValues,
            fetchContactosClientes_por_cliente,
        } = this.props;
        cargando();

        const cargarResponsable = () => {
            if (item_seleccionado.responsable) {
                this.props.fetchUsuario(item_seleccionado.responsable, () => noCargando(), notificarErrorAjaxAction)
            } else {
                noCargando();
            }
        };

        let cargarContactos = cargarResponsable;
        if (initialValues) {
            const {cliente} = initialValues;
            cargarContactos = () => fetchContactosClientes_por_cliente(
                cliente,
                cargarResponsable,
                notificarErrorAjaxAction
            );
        }
        const cargarClientes = () => this.props.fetchClientes(cargarContactos, notificarErrorAjaxAction);
        this.props.fetchUsuariosxPermiso('gestionar_cotizacion', cargarClientes, notificarErrorAjaxAction);
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
        const {estado} = myValues;
        const en_proceso = estado && estado !== 'Pendiente' && estado !== 'Aplazado' && estado !== 'Perdido';
        const esta_aprobado = estado === 'Aprobado';
        const enviado = estado && en_proceso && estado !== 'En Proceso';
        return (
            <form className="card" onSubmit={handleSubmit(onSubmit)}>
                <div className="row pl-3 pr-5">
                    <FormBaseCotizacion
                        contactos_list={contactos_list}
                        cargarContactosCliente={this.cargarContactosCliente}
                        clientes_list={clientes_list}
                        item={initialValues}
                        myValues={myValues}
                        en_proceso={en_proceso}
                        esta_aprobado={esta_aprobado}
                        enviado={enviado}
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
    const {item_seleccionado} = ownProps;
    return {
        myValues: selector(state, 'estado', 'valor_ofertado', 'cliente'),
        initialValues: item_seleccionado
    }
}

Form = reduxForm({
    form: "cotizacionEditForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;