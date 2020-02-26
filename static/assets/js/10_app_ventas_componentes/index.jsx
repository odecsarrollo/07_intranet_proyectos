import React, {memo} from 'react';
import PodioVentaComponente from "./PodioVentaComponente";

const App = memo(props => {
    return (
        <div className='row'>
            <div className="col-12 col-md-6 col-xl-4">
                <PodioVentaComponente/>
            </div>

        </div>
    )
});

export default App;