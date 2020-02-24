import React, {memo} from 'react';
import PodioVentaComponente from "./PodioVentaComponente";

const App = memo(props => {
    return (
        <div className='text-center'>
            <PodioVentaComponente/>
        </div>
    )
});

export default App;