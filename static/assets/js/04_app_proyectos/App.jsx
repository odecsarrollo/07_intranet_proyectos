import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';

import Menu from './00_menu/index';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';
import AppIndex from './index';
import ItemsCGunoList from './cguno/items_cguno/containers/items_list';
import ConcecutivoProyectosList
    from './consecutivo_proyectos/ConsecutivoProyecto';
import HoraHojaTrabajoCRUD from './mano_obra/horas_hojas_trabajo/HoraHojaTrabajoCRUD';
import HojasTrabajoList from './mano_obra/hojas_trabajo/HojaTrabajoCRUD';
import HojasTrabajoDetail from './mano_obra/hojas_trabajo/HojaTrabajoDetail';
import VerificarHorasList from './mano_obra/verificar_horas/containers/horas_verificar_list_container';
import HorasTrabajoColaboradorInicialesList
    from './mano_obra/horas_trabajo_iniciales/containers/horas_trabajo_iniciales_list_container';

import ProyectosCGUnoList from "./proyectos/proyectos/ProyectoCRUD";
import ProyectosCGUnoDetail from "./proyectos/proyectos/ProyectoDetail";

import FasesProyectosList from "./proyectos/fases/containers/fases_list_container";

import ReporteCosto from "./proyectos/reportes/reporte_1/containers/reporte_1";
import ReporteDos from "./proyectos/reportes/reporte_2/containers/reporte_2";
import ReporteTres from "./proyectos/reportes/reporte_3/containers/reporte_3";

import CotizacionesVsProyectos from "./cotizaciones_vs_proyectos/CotizacionVsProyecto";

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
                    <Route exact path='/app/proyectos/mano_obra/horas_hojas_trabajo/list'
                           component={HoraHojaTrabajoCRUD}/>
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

                    <Route exact path='/app/proyectos/cotizaciones_vs_proyectos/list'
                           component={CotizacionesVsProyectos}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default App;