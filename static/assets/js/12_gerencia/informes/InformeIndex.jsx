import React, {memo, Fragment} from 'react';
import InformeVentaFacturacion from './InformeVentaFacturacion';

const InformeIndex = memo((props) => {
    return (
        <Fragment>
            <InformeVentaFacturacion/>
        </Fragment>
    )
});

export default InformeIndex;