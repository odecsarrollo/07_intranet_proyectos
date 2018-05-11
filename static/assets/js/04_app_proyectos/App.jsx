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
import CotizacionesList from './cotizaciones/cotizaciones/containers/cotizaciones_list_container';
import CotizacionesDetail from './cotizaciones/cotizaciones/containers/cotizacion_detail';

const App = (props) => {
    return (
        <Loading>
            <Fragment>
                <Menu/>
                <div className="p-3">
                    <Switch>
                        <Route exact path='/app/proyectos/' component={AppIndex}/>
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
                        <Route exact path='/app/proyectos/cotizaciones/cotizaciones/list'
                               component={CotizacionesList}/>
                        <Route exact path='/app/proyectos/cotizaciones/cotizaciones/detail/:id'
                               component={CotizacionesDetail}/>
                    </Switch>
                </div>
            </Fragment>
        </Loading>
    )
};

export default App;