import React, {Component} from 'react';

import TuberiaVentas from './cotizaciones/tuberia_ventas/containers/tuberia_ventas_list_container';

class App extends Component {
    render() {
        return (
            <div className='row'>
                <div className="col-12 col-xl-6">
                    <TuberiaVentas/>
                </div>
            </div>
        )
    }
}

export default App;