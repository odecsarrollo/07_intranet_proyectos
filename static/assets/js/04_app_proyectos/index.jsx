import React, {Component} from 'react';

import SeguimientoTareasCotizacionesList from './cotizaciones/seguimientos/container/seguimiento_tareas_list';

class App extends Component {
    render() {
        return (
            <div className='row'>
                <div className="col-12 col-xl-6">
                    <SeguimientoTareasCotizacionesList/>
                </div>
            </div>
        )
    }
}

export default App;