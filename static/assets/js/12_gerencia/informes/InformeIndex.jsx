import React, {memo, Fragment} from 'react';
import InformeVentaFacturacion from './InformeVentaFacturacion';
import InformeAcuerdoPagoProyecto from './InformeAcuerdoPagoProyecto';

const InformeVentaFacturacionInformeIndex = memo((props) => {
    return (
        <Fragment>
            <InformeAcuerdoPagoProyecto/>
        </Fragment>
    )
});

export default InformeIndex;