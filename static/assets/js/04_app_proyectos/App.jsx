import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';

import Menu from './00_menu/index';
import AppIndex from './index';
import ItemsCGunoList from './cguno/items_cguno/containers/items_list';
import ConcecutivoProyectosList
    from './literales_proyectos/consecutivo_proyectos/containers/consecutivo_proyectos_container';
import HojasTrabajoList from './mano_obra/hojas_trabajo/containers/hojas_trabajos_list_container';
import HojasTrabajoDetail from './mano_obra/hojas_trabajo/containers/hojas_trabajos_detail';
import VerificarHorasList from './mano_obra/verificar_horas/containers/horas_verificar_list_container';
import ColaboradoresList from './colaboradores/colaboradores/containers/colaboradores_list_container';
import ColaboradoresDetail from './colaboradores/colaboradores/containers/colaborador_detail';
import HorasTrabajoColaboradorInicialesList from './mano_obra/horas_trabajo_iniciales/containers/base_list_container';

import ProyectosCGUnoList from "./proyectos/proyectos/containers/proyectos_list_container";
import ProyectosCGUnoDetail from "./proyectos/proyectos/containers/proyectos_detail";


import ReporteCosto from "./proyectos/reportes/reporte_1/containers/reporte_1";
import ReporteDos from "./proyectos/reportes/reporte_2/containers/reporte_2";
import ReporteTres from "./proyectos/reportes/reporte_3/containers/reporte_3";


//import CargueMateriales from "./proyectos/listado_materiales/containers/cargue_materiales";

import LiteralesSinSincronizar
    from "./proyectos/literales_sin_sincronizar/containers/literales_sin_sincronizar_list_container";
import ClientesList from "../03_app_admin/especificas/clientes/clientes/containers/clientes_container";
import ClienteDetail from "../03_app_admin/especificas/clientes/clientes/containers/cliente_detail";


import PlaneadorMateriaPrima
    from "../04_app_proyectos/proyectos/listado_materiales/containers/planeador_listado_materiales";

const App = (props) => {
    return (
        <Loading>
            <Fragment>
                <Menu/>
                <div className="p-3">
                    <Switch>
                        <Route exact path='/app/proyectos/' component={AppIndex}/>

                        <Route exact path='/app/proyectos/clientes/clientes/list' component={ClientesList}/>
                        <Route exact path='/app/proyectos/clientes/clientes/detail/:id' component={ClienteDetail}/>

                        <Route exact path='/app/proyectos/items/list' component={ItemsCGunoList}/>
                        <Route exact path='/app/proyectos/consecutivo/list' component={ConcecutivoProyectosList}/>
                        <Route exact path='/app/proyectos/mano_obra/hojas_trabajo/list' component={HojasTrabajoList}/>
                        <Route exact path='/app/proyectos/mano_obra/hojas_trabajo/detail/:id'
                               component={HojasTrabajoDetail}/>
                        <Route exact path='/app/proyectos/mano_obra/verificar_horas/list'
                               component={VerificarHorasList}/>
                        <Route exact path='/app/proyectos/colaboradores/colaboradores/list'
                               component={ColaboradoresList}/>
                        <Route exact path='/app/proyectos/colaboradores/colaboradores/detail/:id'
                               component={ColaboradoresDetail}/>
                        <Route exact path='/app/proyectos/mano_obra/horas_colaborador_proyecto_inicial/list'
                               component={HorasTrabajoColaboradorInicialesList}/>
                        <Route exact path='/app/proyectos/proyectos/list' component={ProyectosCGUnoList}/>
                        <Route exact path='/app/proyectos/proyectos/detail/:id' component={ProyectosCGUnoDetail}/>
                        <Route exact path='/app/proyectos/literales_sin_sincronizar/list'
                               component={LiteralesSinSincronizar}/>

                        <Route exact path='/app/proyectos/proyectos/reporte_costos' component={ReporteCosto}/>
                        <Route exact path='/app/proyectos/proyectos/reporte_dos' component={ReporteDos}/>
                        <Route exact path='/app/proyectos/proyectos/reporte_tres' component={ReporteTres}/>


                        <Route path='/app/proyectos/listado_materiales/planeador_materiales/:id'
                               component={PlaneadorMateriaPrima}/>
                    </Switch>
                </div>
            </Fragment>
        </Loading>
    )
};

export default App;