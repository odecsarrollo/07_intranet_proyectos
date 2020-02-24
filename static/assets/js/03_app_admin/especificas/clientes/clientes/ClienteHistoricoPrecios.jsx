import React, {useState} from "react";
import PropTypes from "prop-types";
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../../../../01_actions/01_index';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InformationDisplayDialog from "../../../../00_utilities/components/ui/dialog/InformationDisplayDialog";
import TablaResultado from './ClienteHistoricoPreciosTablaResultado';

const HistoricoPrecio = (props) => {
    const {cliente, id_cotizacion_ignorar = null} = props;
    const dispatch = useDispatch();
    const items_factura = useSelector(state => state.facturas_items);
    let items_cotizaciones = useSelector(state => state.cotizaciones_componentes_items);
    const [parametro_busqueda, setParametroBusqueda] = useState('');
    const [open_historico_precio, setOpenHistoricoPrecio] = useState(false);
    const consultarHistorico = () => {
        if (parametro_busqueda !== '') {
            dispatch(actions.fetchItemsCotizacionesComponentesParametro(cliente.id, parametro_busqueda));
            dispatch(actions.fetchItemFacturasClienteParametro(cliente.id, parametro_busqueda));
        }
    };

    let items_busqueda = [];
    _.map(items_factura, item => {
        items_busqueda = [...items_busqueda,
            {
                id_factura: item.factura,
                id_cotizacion: null,
                origen: 'FACTURA',
                fecha: item.factura_fecha,
                nombre: item.descripcion_item,
                referencia: item.referencia_item,
                nro: `${item.factura_tipo}-${item.factura_nro}`,
                precio: parseFloat(item.venta_bruta / item.cantidad)
            }
        ]
    });
    items_cotizaciones = items_cotizaciones ? _.pickBy(items_cotizaciones, c => c.cotizacion !== id_cotizacion_ignorar) : items_cotizaciones;
    _.map(items_cotizaciones, item => {
        items_busqueda = [...items_busqueda,
            {
                id_factura: null,
                id_cotizacion: item.cotizacion,
                origen: 'COTIZACION',
                fecha: item.cotizacion_fecha,
                nombre: item.descripcion,
                referencia: item.referencia,
                nro: item.cotizacion_nro_consecutivo,
                precio: item.precio_unitario
            }
        ]
    });

    return <div>

        <Button
            color="primary"
            variant="contained"
            onClick={() => setOpenHistoricoPrecio(true)}
            className='ml-3'
        >
            Historico de Precios
        </Button>
        {open_historico_precio && <InformationDisplayDialog
            is_open={open_historico_precio}
            onCerrar={() => {
                setOpenHistoricoPrecio(false);
                setParametroBusqueda('');
                dispatch(actions.clearItemsCotizacionesComponentes());
                dispatch(actions.clearItemsFacturas());
            }}
            fullScreen={true}
            titulo_text={`Historico de precios de ${parametro_busqueda} para ${cliente.to_string}`}
            cerrar_text='Cerrar'
            context_text={`Este es el historico de precios encontrado en cotizaciones y facturación para ${cliente.to_string}`}
        >
            <div className='row'>
                <TextField
                    className='col-12 col-md-4 col-lg-3'
                    label='A consultar...'
                    margin="normal"
                    value={parametro_busqueda}
                    placeholder='busqueda de precio...'
                    onChange={(e) => setParametroBusqueda(e.target.value)}
                />
                {parametro_busqueda !== '' && <Button
                    color="primary"
                    variant="contained"
                    onClick={() => consultarHistorico()}
                    className='ml-3'
                    disabled={parametro_busqueda === ''}
                >
                    Consultar
                </Button>}
                <div className="col-12">
                    {items_busqueda.length > 0 && <TablaResultado list={items_busqueda}/>}
                </div>
            </div>
        </InformationDisplayDialog>}
    </div>
};
HistoricoPrecio.propTypes = {
    cliente: PropTypes.object.isRequired,
    id_cotizacion_ignorar: PropTypes.number,
};

export default HistoricoPrecio;