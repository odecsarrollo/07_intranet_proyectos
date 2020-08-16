import React, {memo, Fragment} from 'react';
import InformeVentaFacturacion from './InformeVentaFacturacion';
import InformeAcuerdoPagoProyecto from './InformeAcuerdoPagoProyecto';

const InformeIndex = memo((props) => {
    return (
        <Fragment>
            <InformeVentaFacturacion/>
        </Fragment>
    )
});

export default InformeIndex;