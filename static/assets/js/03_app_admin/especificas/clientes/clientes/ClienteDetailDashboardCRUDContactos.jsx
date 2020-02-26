import React, {memo, useEffect, Fragment} from 'react';
import CreateForm from './forms/ClienteDetailDashboardCRUDContactoForm';
import Tabla from './ClienteDetailDashboardCRUDContactosTabla';
import crudHOC from '../../../../00_utilities/components/HOC_CRUD2';
import * as actions from "../../../../01_actions/01_index";
import {useSelector, useDispatch} from "react-redux";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {CONTACTOS_CLIENTES} from "../../../../permisos";
import ContactoFusionar from "./ContactoFusionar";

const CRUD = crudHOC(CreateForm, Tabla);

const ClienteDetailDashboardCRUDContactos = memo(props => {
    const dispatch = useDispatch();
    const {cliente_id, cargarCliente} = props;
    const permisos = useTengoPermisos(CONTACTOS_CLIENTES);
    const cargarDatos = () => {
        if (permisos.list) {
            const callback = () => dispatch(actions.fetchContactosClientes_por_cliente(cliente_id));
            cargarCliente(callback);
        }
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearContactosClientes());
        };
    }, [permisos.list]);
    const list = useSelector(state => state.clientes_contactos);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchContactoCliente(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteContactoCliente(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createContactoCliente(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateContactoCliente(id, item, options)),
    };
    return (
        <Fragment>
            {permisos.fusionar && <ContactoFusionar contactos={list} cargarContactos={cargarDatos}/>}
            <CRUD
                posSummitMethod={() => cargarDatos()}
                cliente_id={cliente_id}
                method_pool={method_pool}
                list={list}
                permisos_object={permisos}
                singular_name='Contacto'
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});

export default ClienteDetailDashboardCRUDContactos;
