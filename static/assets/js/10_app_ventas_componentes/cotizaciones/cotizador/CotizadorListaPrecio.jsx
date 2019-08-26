import React, {memo, useState, useEffect, Fragment, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as actions from "../../../01_actions/01_index";
import Combobox from "react-widgets/lib/Combobox";
import CotizadorListaPrecioTabla from './CotizadorListaPrecioTabla';

const CotizadorListaPrecio = memo(props => {
    const dispatch = useDispatch();
    const {adicionarItem = null} = props;
    useEffect(() => {
        dispatch(actions.fetchFormasPagos());
        return () => {
            dispatch(actions.clearFormasPagos());
            dispatch(actions.clearBandasEurobelt());
            dispatch(actions.clearBandaEurobeltComponentes());
            dispatch(actions.clearItemsVentasCatalogos());
        };
    }, []);
    const [busqueda, setBusqueda] = useState('');
    const [forma_pago, setFormaPago] = useState(null);
    let bandas_eurobelt = useSelector(state => state.banda_eurobelt_bandas);
    let componentes_eurobelt = useSelector(state => state.banda_eurobelt_componentes);
    let articulos_catalogos = useSelector(state => state.catalogos_productos_items_ventas);
    const formas_pago = useSelector(state => state.formas_pagos_canales);

    let todos_los_items = [];
    if (forma_pago) {
        const porcentaje = forma_pago.porcentaje / 100;
        bandas_eurobelt = _.map(bandas_eurobelt, b => ({
            tipo_item: 'BandaEurobelt',
            precio_unitario: Math.ceil((b.precio_con_mano_obra * (1 + porcentaje)) / 1000) * 1000,
            precio_unitario_aereo: 0,
            item_descripcion: b.nombre.toUpperCase(),
            item_referencia: b.referencia.toUpperCase(),
            item_unidad_medida: 'La unidad de medida',
            id_item: b.id,
            forma_pago_id: forma_pago.id,
        }));

        componentes_eurobelt = _.map(componentes_eurobelt, b => ({
            tipo_item: 'ComponenteEurobelt',
            precio_unitario: Math.ceil((b.precio_base * (1 + porcentaje)) / 1000) * 1000,
            precio_unitario_aereo: Math.ceil((b.precio_base_aereo * (1 + porcentaje) / 1000)) * 1000,
            item_descripcion: b.nombre.toUpperCase(),
            item_referencia: b.referencia.toUpperCase(),
            item_unidad_medida: 'La unidad de medida',
            id_item: b.id,
            forma_pago_id: forma_pago.id,
        }));

        articulos_catalogos = _.map(articulos_catalogos, b => ({
            tipo_item: 'ArticuloCatalogo',
            precio_unitario: Math.ceil((b.precio_base * (1 + porcentaje)) / 1000) * 1000,
            precio_unitario_aereo: Math.ceil((b.precio_base_aereo * (1 + porcentaje) / 1000)) * 1000,
            item_descripcion: b.nombre.toUpperCase(),
            item_referencia: b.referencia.toUpperCase(),
            item_unidad_medida: 'La unidad de medida',
            id_item: b.id,
            forma_pago_id: forma_pago.id,
        }));
        todos_los_items = _.orderBy([...bandas_eurobelt, ...componentes_eurobelt, ...articulos_catalogos], ['item_descripcion'], ['asc']);
    }

    const consultarItems = () => {
        dispatch(actions.fetchBandasEurobeltxParametro(busqueda));
        dispatch(actions.fetchBandaEurobeltComponentesxParametro(busqueda));
        dispatch(actions.fetchItemsVentasCatalogosxParametro(busqueda));
    };
    return (
        <div className='row'>
            <div className="col-4">
                <label>Forma Pago</label>
                <Combobox
                    data={_.map(formas_pago, f => ({...f, nombre: `${f.canal_nombre} ${f.forma}`}))}
                    onSelect={
                        e => {
                            setFormaPago(e)
                        }}
                    placeholder='Seleccionar Forma Pago'
                    valueField='id'
                    textField='nombre'
                    filter='contains'
                />
            </div>
            {forma_pago &&
            <Fragment>
                <div className="col-8">
                    <TextField
                        fullWidth={true}
                        label='Busqueda'
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="col-12">
                    <Button
                        color="primary"
                        variant="contained"
                        className='ml-3'
                        onClick={() => consultarItems()}
                    >
                        Consultar
                    </Button>
                </div>
                <div className="col-12">
                    <CotizadorListaPrecioTabla items={todos_los_items} adicionarItem={adicionarItem}/>
                </div>
            </Fragment>
            }
        </div>
    )
});

export default CotizadorListaPrecio;