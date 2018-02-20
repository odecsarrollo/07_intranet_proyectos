import React, {Component} from 'react';

class App extends Component {
    render() {
        return (
            <div className='text-center'>
                <img src={`${img_static_url}/logo.png`} alt="logo"/>
            </div>
        )
    }
}

export default App;


// import UsuariosList from "../03_app_admin/generales/usuarios/containers/usuarios_list";
// import App1 from "../03_app_admin";
// import PermisosList from "../03_app_admin/generales/permisos/containers/permisos_list";
// import UsuariosDetail from "../03_app_admin/generales/usuarios/containers/usuarios_detail";
// import GruposPermisosList from "../03_app_admin/generales/permisos/containers/grupos_permisos_list";

// import TasasHorasHombresList from './00_maestras/containers/mano_obra/tasas_hora_hombre_list';
// import HojaTrabajoDiarioList from './01_mano_obra/containers/hoja_trabajo_diario/hojas_trabajos_diarios_list';
// import HojaTrabajoDiarioDetail from './01_mano_obra/containers/hoja_trabajo_diario/hoja_trabajo_diario_detail';
// import ColaboradoresList from './00_maestras/containers/cguno/colaboradores/colaboradores_list';
//
// import ProyectosList from './00_maestras/containers/proyectos/proyectos/proyectos_list';
// import ItemsCgunoList from './00_maestras/containers/cguno/items_cguno/items_cguno_list';
// import ProyectosDetail from './00_maestras/containers/proyectos/proyectos/proyectos_detail';


// ReactDOM.render(
//     < Provider store={store}>
//         <MuiThemeProvider muiTheme={getMuiTheme()}>
//             <BrowserRouter>
//                 <div>
//                     <Notify/>
//                     <div id="react-no-print">
//                         <Menu/>
//                     </div>
//                     <Switch>
//                         <Route path='/app/maestras/proyectos/proyectos/list' component={ProyectosList}/>
//                         {/*<Route path='/app/maestras/cguno/item_cguno/list' component={ItemsCgunoList}/>*/}
//                         {/*<Route path='/app/maestras/cguno/colaboradores/list' component={ColaboradoresList}/>*/}
//
//                         {/*<Route path='/app/mano_obra/hojas_trabajo/list' component={HojaTrabajoDiarioList}/>*/}
//                         {/*<Route path='/app/mano_obra/hojas_trabajo/detail/:id' component={HojaTrabajoDiarioDetail}/>*/}
//
//                         {/*<Route path='/app/maestras/mano_obra/tasas/list' component={TasasHorasHombresList}/>*/}
//                         {/*<Route path='/app/maestras/proyectos/proyectos/detail/:id' component={ProyectosDetail}/>*/}
//                     </Switch>
//                 </div>
//             </BrowserRouter>
//         </MuiThemeProvider>
//     </Provider>
//     , document.querySelector('.react_app')
// );

