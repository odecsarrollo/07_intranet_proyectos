import React from 'react';
import {useSelector} from "react-redux";
import {PROYECTOS} from "../../permisos";
import Tabla from './ConsecutivoProyectoTabla';

import crudHOC from '../../00_utilities/components/HOC_CRUD2';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";

const CRUD = crudHOC(null, Tabla);

const ConsecutivoProyecto = (props) => {
    const permisos_proyectos = useTengoPermisos(PROYECTOS);
    const proyectos_list = useSelector(state => state.proyectos);
    const method_pool = {};
    return (
        <CRUD
            method_pool={method_pool}
            list={_.orderBy(proyectos_list, ['id_proyecto'], ['desc'])}
            permisos_object={{...permisos_proyectos, add: false, list: permisos_proyectos.list_consecutivo_proyectos}}
            plural_name='Consecutivo de Proyecto'
            singular_name=''
        />
    )

};
export default ConsecutivoProyecto;