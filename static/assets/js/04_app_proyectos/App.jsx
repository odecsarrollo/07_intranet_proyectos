import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';

import Menu from './00_menu/index';
import AppIndex from './index';
import ItemsCGunoList from './cguno/items_cguno/containers/items_list';
import HojasTrabajoList from './mano_obra/hojas_trabajo/containers/hojas_trabajos_list_container';
import HojasTrabajoDetail from './mano_obra/hojas_trabajo/containers/hojas_trabajos_detail';

const App = (props) => {
    return (
        <Loading>
            <Fragment>
                <Menu/>
                <div className="p-3">
                    <Switch>
                        <Route exact path='/app/proyectos/' component={AppIndex}/>
                        <Route exact path='/app/proyectos/items/list' component={ItemsCGunoList}/>
                        <Route exact path='/app/proyectos/mano_obra/hojas_trabajo/list' component={HojasTrabajoList}/>
                        <Route exact path='/app/proyectos/mano_obra/hojas_trabajo/detail/:id' component={HojasTrabajoDetail}/>
                    </Switch>
                </div>
            </Fragment>
        </Loading>
    )
};

export default App;