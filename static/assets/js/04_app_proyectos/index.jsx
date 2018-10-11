import React, {Component} from 'react';
import Dashboard from './dashboard_inicio/dashboard/dashboard_proyectos';

class App extends Component {
    render() {
        return (
            <div className='row'>
                <Dashboard/>
            </div>
        )
    }
}

export default App;