import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';

import Menu from './00_menu/index';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';
import AppIndex from './index';
import ItemsCGunoList from './cguno/items_cguno/containers/items_list';
import ConcecutivoProyectosList
    from './literales_proyectos/consecutivo_proyectos/containers/consecutivo_proyectos_container';
import HojasTrabajoList from './mano_obra/hojas_trabajo/containers/hojas_trabajos_list_container';
import HojasTrabajoDetail from './mano_obra/hojas_trabajo/containers/hojas_trabajos_detail';
import VerificarHorasList from './mano_obra/verificar_horas/containers/horas_verificar_list_container';
import HorasTrabajoColaboradorInicialesList from './mano_obra/horas_trabajo_iniciales/containers/horas_trabajo_iniciales_list_container';

import ProyectosCGUnoList from "./proyectos/proyectos/containers/proyectos_list_container";
import ProyectosCGUnoDetail from "./proyectos/proyectos/containers/proyectos_detail";

import FasesProyectosList from "./proyectos/fases/containers/fases_list_container";

import ReporteCosto from "./proyectos/reportes/reporte_1/containers/reporte_1";
import ReporteDos from "./proyectos/reportes/reporte_2/containers/reporte_2";
import ReporteTres from "./proyectos/reportes/reporte_3/containers/reporte_3";


import PlaneadorMateriaPrima
    from "../04_app_proyectos/proyectos/listado_materiales/containers/planeador_listado_materiales";

const App = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Ventas'>
                <Switch>
                    <Route exact path='/app/proyectos/' component={AppIndex}/>

                    <Route exact path='/app/proyectos/fases/list' component={FasesProyectosList}/>

                    <Route exact path='/app/proyectos/items/list' component={ItemsCGunoList}/>
                    <Route exact path='/app/proyectos/consecutivo/list' component={ConcecutivoProyectosList}/>
                    <Route exact path='/app/proyectos/mano_obra/hojas_trabajo/list' component={HojasTrabajoList}/>
                    <Route exact path='/app/proyectos/mano_obra/hojas_trabajo/detail/:id'
                           component={HojasTrabajoDetail}/>
                    <Route exact path='/app/proyectos/mano_obra/verificar_horas/list'
                           component={VerificarHorasList}/>
                    <Route exact path='/app/proyectos/mano_obra/horas_colaborador_proyecto_inicial/list'
                           component={HorasTrabajoColaboradorInicialesList}/>
                    <Route exact path='/app/proyectos/proyectos/list' component={ProyectosCGUnoList}/>
                    <Route exact path='/app/proyectos/proyectos/detail/:id' component={ProyectosCGUnoDetail}/>

                    <Route exact path='/app/proyectos/proyectos/reporte_costos' component={ReporteCosto}/>
                    <Route exact path='/app/proyectos/proyectos/reporte_dos' component={ReporteDos}/>
                    <Route exact path='/app/proyectos/proyectos/reporte_tres' component={ReporteTres}/>


                    <Route path='/app/proyectos/listado_materiales/planeador_materiales/:id'
                           component={PlaneadorMateriaPrima}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default App;