import React, {memo, useEffect, Fragment} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {CLIENTES} from "../../../../permisos";
import CreateForm from './forms/ClienteCRUDForm';
import Tabla from './ClienteTabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import FusionarCliente from "./ClienteFusionar";

const CRUD = crudHOC(CreateForm, Tabla);
const List = memo(props => {
    const dispatch = useDispatch();
    const {modulo = 'ventas_proyectos'} = props;
    console.log(props);
    const cargarDatos = () => {
        dispatch(actions.fetchClientes());
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearClientes());
        };
    }, []);
    const list = useSelector(state => state.clientes);
    const permisos = useTengoPermisos(CLIENTES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCliente(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCliente(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCliente(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCliente(id, item, options)),
    };
    return (
        <Fragment>
            {permisos.fusionar && <FusionarCliente list={list}/>}
            <CRUD
                modulo={modulo}
                posSummitMethod={() => cargarDatos()}
                method_pool={method_pool}
                list={list}
                permisos_object={permisos}
                plural_name='Clientes'
                singular_name='Cliente'
                cargarDatos={cargarDatos}
            />
        </Fragment>
    )
});

export default List;