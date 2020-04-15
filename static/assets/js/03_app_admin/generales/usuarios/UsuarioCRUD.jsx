import React, {memo, useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {USUARIOS} from "../../../permisos";
import CreateForm from './forms/UsuarioForm';
import Tabla from './UsuarioCRUDTabla';
import crudHOC from '../../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(CreateForm, Tabla);

const UsuarioCRUD = memo(props => {
    const dispatch = useDispatch();
    const cargarDatos = () => dispatch(actions.fetchUsuarios());
    const permisos = useTengoPermisos(USUARIOS);
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearUsuarios());
        }
    },[]);
    const usuarios = useSelector(state => state.usuarios);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchUsuario(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteUsuario(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createUsuario(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateUsuario(id, item, options)),
        selectForDeleteObjectMethod: (id, options) => dispatch(actions.fetchUsuario(id, options)),
    };
    return (
        <CRUD
            method_pool={method_pool}
            list={usuarios}
            permisos_object={permisos}
            plural_name='Usuarios'
            singular_name='Usuario'
            cargarDatos={cargarDatos}
        />
    )
});
export default UsuarioCRUD;