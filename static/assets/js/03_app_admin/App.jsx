import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';

import Menu from './00_menu/index';

import App1 from "./index";
import PermisosList from "./generales/permisos/containers/permisos_list";
import GruposPermisosList from "./generales/permisos/containers/grupos_permisos_list";
import UsuariosList from "./generales/usuarios/usuarios/containers/usuarios_list_container";
import ColaboradoresDashBoard from "./especificas/cguno/colaboradores/colaboradores_dashboard/containers/colaboradores_dashboard";
import ColaboradorDetail from "./especificas/cguno/colaboradores_viejo/colaboradores/containers/colaborador_detail";
import UsuariosDetail from "./generales/usuarios/usuarios/containers/usuarios_detail";
import ProyectosCGUnoList from "./especificas/cguno/proyectos/containers/proyectos_list";
import ProyectosCGUnoDetail from "./especificas/cguno/proyectos/containers/proyecto_detail";


const AdminApp = (props) => {
    return (
        <Loading>
            <Fragment>
                <Menu/>
                <div className="p-3">
                    <Switch>
                        <Route exact path='/app/admin/' component={App1}/>
                        <Route exact path='/app/admin/permisos/list' component={PermisosList}/>
                        <Route exact path='/app/admin/grupos_permisos/list' component={GruposPermisosList}/>
                        <Route exact path='/app/admin/usuarios/list' component={UsuariosList}/>
                        <Route exact path='/app/admin/colaboradores/dashboard' component={ColaboradoresDashBoard}/>
                        <Route exact path='/app/admin/usuarios/detail/:id' component={UsuariosDetail}/>
                        <Route exact path='/app/admin/cguno/proyectos/list' component={ProyectosCGUnoList}/>
                        <Route exact path='/app/admin/cguno/proyectos/detail/:id' component={ProyectosCGUnoDetail}/>
                        <Route exact path='/app/admin/cguno/colaborador/detail/:id' component={ColaboradorDetail}/>
                    </Switch>
                </div>
            </Fragment>
        </Loading>
    )
};

export default AdminApp;