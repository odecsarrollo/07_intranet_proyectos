import React, {useEffect} from 'react';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../hooks/useTengoPermisos";
import {CORREOS_APLICACIONES} from "../../../../../permisos";
import crudHOC from "../../../HOC_CRUD2";
import CreateForm from "./form/CorreoCRUDForm";
import Tabla from "./CorreoCRUDTable";
import PropTypes from "prop-types";

const CRUD = crudHOC(CreateForm, Tabla);

const CorreoCRUD = (props) => {
    const dispatch = useDispatch();
    const {aplicacion, plural_name, singular_name} = props;
    const cargarDatos = () => {
        dispatch(actions.fetchCorreosAplicacionesxAplicacion(aplicacion));
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearCorreosAplicaciones());
        };
    }, []);
    const list = useSelector(state => state.correos_aplicaciones);
    const permisos = useTengoPermisos(CORREOS_APLICACIONES);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCorreoAplicacion(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCorreoAplicacion(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCorreoAplicacion({...item, aplicacion}, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCorreoAplicacion(id, item, options)),
    };
    return (
        <CRUD
            aplicacion={aplicacion}
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name={plural_name}
            singular_name={singular_name}
            cargarDatos={cargarDatos}
        />
    )
};
CorreoCRUD.propTypes = {
    aplicacion: PropTypes.string,
    plural_name: PropTypes.string,
    singular_name: PropTypes.string
};

export default CorreoCRUD;