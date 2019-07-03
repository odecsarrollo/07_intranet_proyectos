import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

import Menu from './00_menu/Menu';

import App1 from "./index";
import PermisosList from "./generales/permisos/containers/PermisoList";
import GruposPermisosList from "./generales/permisos/containers/GrupoPermisoList";
import UsuariosList from "./generales/usuarios/containers/UsuarioListContainer";
import ColaboradoresDashBoard
    from "./especificas/cguno/colaboradores/dashboard/containers/ColaboradorDashboard";
import ColaboradoresDetail from "./especificas/cguno/colaboradores/colaboradores/containers/base_detail";
import ColaboradoresCostosNominaList
    from "./especificas/cguno/colaboradores/costos_nomina/containers/CostoNominaListContainer";
import UsuariosDetail from "./generales/usuarios/containers/UsuarioDetail";
import ClientesList from "./especificas/clientes/clientes/containers/ClienteContainer";
import ClientesDashboard from "./especificas/clientes/dashboard/containers/ClienteDashboard";
import SistemaInformacionOrigenList
    from "./especificas/sistemas_informacion_origen/containers/SistemaInformacionOrigenContainer";
import GeografiaList
    from "./especificas/geografia/GeografiaDashboard";

import ConfiguracionCostosDashboard from "./especificas/configuraciones/containers/CostoDashboard";
import ItemsDashboard from "./especificas/items/dashboard/containers/ItemDashboard";
import ImportacionesDashboard
    from "./especificas/importaciones/dashboard/containers/ImportacionDashboard";
import ListasPreciosDashboard
    from "./especificas/listas_precios/dashboard/containers/ListaPrecioDashboard";


class AdminApp extends Component {
    render() {
        return (
            <Loading>
                <DrawerMenu lista_menu={<Menu/>} titulo='Admin'>
                    <Switch>
                        <Route exact path='/app/admin/' component={App1}/>
                        <Route exact path='/app/admin/sistemas_informacion/list'
                               component={SistemaInformacionOrigenList}/>
                        <Route exact path='/app/admin/geografia/list' component={GeografiaList}/>
                        <Route exact path='/app/admin/permisos/list' component={PermisosList}/>
                        <Route exact path='/app/admin/grupos_permisos/list' component={GruposPermisosList}/>
                        <Route exact path='/app/admin/usuarios/list' component={UsuariosList}/>
                        <Route exact path='/app/admin/colaboradores/dashboard' component={ColaboradoresDashBoard}/>
                        <Route exact path='/app/admin/colaboradores/costos_nomina/list'
                               component={ColaboradoresCostosNominaList}/>
                        <Route exact path='/app/admin/cguno/colaborador/detail/:id' component={ColaboradoresDetail}/>
                        <Route exact path='/app/admin/usuarios/detail/:id' component={UsuariosDetail}/>
                        <Route exact path='/app/admin/clientes/clientes/list' component={ClientesList}/>
                        <Route exact path='/app/admin/clientes/clientes/dashboard' component={ClientesDashboard}/>
                        <Route exact path='/app/admin/configuraciones/costos/dashboard'
                               component={ConfiguracionCostosDashboard}/>
                        <Route exact path='/app/admin/items/dashboard' component={ItemsDashboard}/>
                        <Route exact path='/app/admin/importaciones/dashboard' component={ImportacionesDashboard}/>
                        <Route exact path='/app/admin/listas_precios/dashboard' component={ListasPreciosDashboard}/>
                    </Switch>
                </DrawerMenu>
            </Loading>
        )
    }
}

export default AdminApp;