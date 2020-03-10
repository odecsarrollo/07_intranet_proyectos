import React, {memo, useEffect} from 'react';
import CreateForm from './forms/UnidadMedidaCatalogoCRUDForm';
import Tabla from './UnidadMedidaCatalogoCRUDTabla';
import crudHOC from '../../../../00_utilities/components/HOC_CRUD2';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import * as actions from "../../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {UNIDADES_MEDIDAS_CATALOGOS} from "../../../../permisos";

const CRUD = crudHOC(CreateForm, Tabla);

const List = memo((props) => {
    const dispatch = useDispatch();
    const onCargar = () => {
        dispatch(actions.fetchUnidadesMedidasCatalogos());
    };
    useEffect(() => {
        onCargar();
        return () => {
            dispatch(actions.clearUnidadesMedidasCatalogos());
        };
    }, []);
    const list = useSelector(state => state.unidades_medidas);
    const permisos = useTengoPermisos(UNIDADES_MEDIDAS_CATALOGOS);
    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchUnidadMedidaCatalogo(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteUnidadMedidaCatalogo(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createUnidadMedidaCatalogo(item, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateUnidadMedidaCatalogo(id, item, options)),
    };
    return (
        <CRUD
            method_pool={method_pool}
            list={list}
            permisos_object={permisos}
            plural_name=''
            singular_name='Unidad Medida'
        />
    )
});

export default List;