import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';

import Menu from './00_menu/index';

import App1 from "./index";
import PermisosList from "./generales/permisos/containers/permisos_list";
import GruposPermisosList from "./generales/permisos/containers/grupos_permisos_list";
import UsuariosList from "./generales/usuarios/usuarios/containers/usuarios_list_container";
import ColaboradoresDashBoard
    from "./especificas/cguno/colaboradores/colaboradores_dashboard/containers/colaboradores_dashboard";
import ColaboradoresDetail from "./especificas/cguno/colaboradores/colaboradores/containers/base_detail";
import ColaboradoresCostosNominaList
    from "./especificas/cguno/colaboradores/costos_nomina/containers/costos_nomina_list_container";
import UsuariosDetail from "./generales/usuarios/usuarios/containers/usuarios_detail";
import ClientesList from "./especificas/clientes/clientes/containers/clientes_container";


import ConfiguracionCostosDashboard from "./especificas/configuraciones/containers/costos_dashboard";


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
                        <Route exact path='/app/admin/colaboradores/costos_nomina/list'
                               component={ColaboradoresCostosNominaList}/>
                        <Route exact path='/app/admin/cguno/colaborador/detail/:id' component={ColaboradoresDetail}/>
                        <Route exact path='/app/admin/usuarios/detail/:id' component={UsuariosDetail}/>
                        <Route exact path='/app/admin/clientes/clientes/list' component={ClientesList}/>
                        <Route exact path='/app/admin/configuraciones/costos/dashboard'
                               component={ConfiguracionCostosDashboard}/>
                    </Switch>
                </div>
            </Fragment>
        </Loading>
    )
};

export default AdminApp;