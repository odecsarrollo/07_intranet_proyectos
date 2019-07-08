import React, {memo, useEffect} from 'react';
import {reduxForm} from 'redux-form';
import {useDispatch, useSelector} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import FormBaseCotizacion from '../forms/base_cotizacion_form';
import {formValueSelector} from 'redux-form';
import * as actions from '../../../../../01_actions/01_index';

const selector = formValueSelector('cotizacionForm');

let Form = memo(props => {
    const dispatch = useDispatch();
    const {
        initialValues,
        pristine,
        submitting,
        reset,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name
    } = props;
    const myValues = useSelector(state => selector(state, 'estado', 'valor_ofertado', 'cliente', 'subir_anterior'));
    const contactos_list = useSelector(state => state.clientes_contactos);
    const clientes_list = useSelector(state => state.clientes);
    useEffect(() => {
        let cargarContactos = () => console.log('para retornar algo');
        if (initialValues) {
            const {cliente} = initialValues;
            cargarContactos = () => dispatch(actions.fetchContactosClientes_por_cliente(cliente));
        }
        dispatch(actions.fetchClientes({callback: cargarContactos}));
        return () => {
            dispatch(actions.clearClientes());
            dispatch(actions.clearContactosClientes());
        };
    }, []);

    const cargarContactosCliente = (cliente_id) => {
        dispatch(actions.fetchContactosClientes_por_cliente(cliente_id));
    };

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
                cargarContactosCliente={cargarContactosCliente}
                item={initialValues}
                myValues={myValues}
                contactos_list={contactos_list}
                clientes_list={clientes_list}
            />
            <div style={{height: '300px'}}>

            </div>
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "cotizacionForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;