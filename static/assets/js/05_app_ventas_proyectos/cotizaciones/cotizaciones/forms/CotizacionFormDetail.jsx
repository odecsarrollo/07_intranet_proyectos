import React, {useEffect, memo} from 'react';
import {reduxForm, formValueSelector} from 'redux-form';
import {useDispatch, useSelector} from "react-redux";
import validate from '../../tuberia_ventas/forms/validate';
import FormBaseCotizacion from './CotizacionFormBase';
import BotoneriaModalForm from '../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import {MyCombobox} from '../../../../00_utilities/components/ui/forms/fields';
import * as actions from '../../../../01_actions/01_index';

const selector = formValueSelector('cotizacionEditForm');

let Form = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        handleSubmit,
    } = props;
    const dispatch = useDispatch();
    const myValues = useSelector(state => selector(state, 'estado', 'valor_ofertado', 'cliente'));
    const usuarios_list = useSelector(state => state.usuarios);
    const clientes_list = useSelector(state => state.clientes);
    const contactos_list = useSelector(state => state.clientes_contactos);


    const cargarContactosCliente = (cliente_id) => {
        dispatch(actions.fetchContactosClientes_por_cliente(cliente_id));
    };

    useEffect(() => {
        dispatch(actions.fetchUsuariosxPermiso('gestionar_cotizacion'));
        dispatch(actions.fetchUsuario(initialValues.responsable));
        return () => dispatch(actions.clearUsuarios());
    }, []);

    useEffect(() => {
        dispatch(actions.fetchClientes());
        return () => {
            dispatch(actions.clearClientes());
        }
    }, []);


    useEffect(() => {
        dispatch(actions.fetchContactosClientes_por_cliente(initialValues.cliente));
        return () => {
            dispatch(actions.clearContactosClientes());
        }
    }, []);

    return (
        <form className="card" onSubmit={handleSubmit(onSubmit)}>
            <div className="row pl-3 pr-5">
                <FormBaseCotizacion
                    contactos_list={contactos_list}
                    cargarContactosCliente={cargarContactosCliente}
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
                mostrar_cancelar={false}
                pristine={pristine}
                reset={reset}
                submitting={submitting}
                initialValues={initialValues}
            />
        </form>
    )


});


Form = reduxForm({
    form: "cotizacionEditForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;