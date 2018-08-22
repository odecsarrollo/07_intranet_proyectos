import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';

import Menu from './00_menu/index';
import AppIndex from './index';
import CotizacionesList from './cotizaciones/cotizaciones/containers/cotizaciones_list_container';
import CotizacionesDetail from './cotizaciones/tuberia_ventas/containers/cotizacion_detail';

const App = (props) => {
    return (
        <Loading>
            <Fragment>
                <Menu/>
                <div className="p-3">
                    <Switch>
                        <Route exact path='/app/ventas/' component={AppIndex}/>
                        <Route exact path='/app/ventas/cotizaciones/cotizaciones/list'
                               component={CotizacionesList}/>
                        <Route exact path='/app/ventas/cotizaciones/cotizaciones/detail/:id'
                               component={CotizacionesDetail}/>
                    </Switch>
                </div>
            </Fragment>
        </Loading>
    )
};

export default App;