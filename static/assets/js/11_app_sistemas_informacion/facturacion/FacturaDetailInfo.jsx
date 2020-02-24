import React from "react";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";

const FacturaDetailInfo = (props) => {
    const {factura: {cliente_nombre, cliente_nit, cliente, vendedor_nombre, vendedor_apellido}} = props;
    return <div className='row'>
        <div className="col-12 col-md-6 col-xl-4">
            <div className="row">
                <Typography variant="body1" gutterBottom color="primary">
                    Cliente:
                </Typography>
                <Link to={`/app/ventas_componentes/clientes/clientes/detail/${cliente}`} target='_blank'>
                    <Typography variant="body1" gutterBottom color="secondary">
                        {cliente_nombre}
                    </Typography>
                </Link>
            </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4">
            <div className="row">
                <Typography variant="body1" gutterBottom color="primary">
                    Vendedor:
                </Typography>
                <Typography variant="body1" gutterBottom color="secondary">
                    {vendedor_nombre} {vendedor_apellido}
                </Typography>
            </div>
        </div>
    </div>
};

export default FacturaDetailInfo;