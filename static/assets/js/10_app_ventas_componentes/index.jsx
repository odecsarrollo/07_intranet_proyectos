import React, {memo} from 'react';
import PodioVentaComponente from "./PodioVentaComponente";

const App = memo(props => {
    return (
        <div className='row'>
            <div className="col-12 col-lg-6 col-xl-4 text-center">
                <PodioVentaComponente titulo='Acumulado Ventas por vendedor'/>
            </div>
            <div className="col-12 col-lg-6 col-xl-4 text-center">
                <PodioVentaComponente solo_totales={true} titulo='Acumulado Total Ventas'/>
            </div>
            <div className="col-12 col-lg-6 col-xl-4 text-center">
                <PodioVentaComponente solo_notas={true} titulo='Solo Notas'/>
            </div>
        </div>
    )
});

export default App;