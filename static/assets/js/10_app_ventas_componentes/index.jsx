import React, {memo} from 'react';
import PodioVentaComponente from "./PodioVentaComponente";
import useTengoPermisos from "../00_utilities/hooks/useTengoPermisos";
import {FACTURAS} from "../permisos";

const App = memo(props => {
    const permisos_facturas = useTengoPermisos(FACTURAS);
    return (
        <div className='row'>
            <div className="col-12 col-lg-6 col-xl-4 text-center">
                <PodioVentaComponente titulo='Acumulado Ventas por vendedor' cargar_facturacion={true}
                                      permisos_facturas={permisos_facturas}/>
            </div>
            <div className="col-12 col-lg-6 col-xl-4 text-center">
                <PodioVentaComponente solo_totales={true} titulo='Acumulado Total Ventas' cargar_facturacion={false}
                                      permisos_facturas={permisos_facturas}/>
            </div>
            <div className="col-12 col-lg-6 col-xl-4 text-center">
                <PodioVentaComponente solo_notas={true} titulo='Solo Notas' cargar_facturacion={false}
                                      permisos_facturas={permisos_facturas}/>
            </div>
        </div>
    )
});

export default App;