import React, {memo, useState, useEffect, Fragment, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as actions from "../../01_actions/01_index";
import Combobox from "react-widgets/lib/Combobox";
import ListaPrecioTabla from './ListaPrecioTabla';
import PropTypes from "prop-types";

const ListaPrecio = memo(props => {
    const dispatch = useDispatch();
    const {
        adicionarItem = null,
        con_bandas = true,
        con_componentes = true,
        con_articulos_venta_catalogo = true,
        con_costos = true,
        con_precios = true,
    } = props;
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
    if ((con_precios && forma_pago) || (con_costos && !con_precios)) {
        const porcentaje = forma_pago ? forma_pago.porcentaje / 100 : 0;
        bandas_eurobelt = _.map(bandas_eurobelt, b => ({
            tipo_item: 'BandaEurobelt',
            precio_unitario: Math.ceil((b.precio_con_mano_obra * (1 + porcentaje)) / 1000) * 1000,
            precio_unitario_aereo: Math.ceil((b.precio_con_mano_obra_aereo * (1 + porcentaje)) / 1000) * 1000,
            item_descripcion: b.nombre.toUpperCase(),
            item_referencia: b.referencia.toUpperCase(),
            item_unidad_medida: `${(b.largo / 1000)} Metro(s)`,
            id_item: b.id,
            forma_pago_id: forma_pago && forma_pago.id,
            costo_cop: b.costo_cop_mano_obra,
            costo_cop_aereo: b.costo_cop_aereo_mano_obra,
            origen: 'Bandas Eurobelt',
        }));

        componentes_eurobelt = _.map(componentes_eurobelt, b => ({
            tipo_item: 'ComponenteEurobelt',
            precio_unitario: Math.ceil((b.precio_base * (1 + porcentaje)) / 1000) * 1000,
            precio_unitario_aereo: Math.ceil((b.precio_base_aereo * (1 + porcentaje) / 1000)) * 1000,
            item_descripcion: b.nombre.toUpperCase(),
            item_referencia: b.referencia.toUpperCase(),
            item_unidad_medida: 'Unidad',
            id_item: b.id,
            forma_pago_id: forma_pago && forma_pago.id,
            costo_cop: b.costo_cop,
            costo_cop_aereo: b.costo_cop_aereo,
            origen: 'Componentes Eurobelt',
        }));

        articulos_catalogos = _.map(articulos_catalogos, b => ({
            tipo_item: 'ArticuloCatalogo',
            precio_unitario: Math.ceil((b.precio_base * (1 + porcentaje)) / 1000) * 1000,
            precio_unitario_aereo: Math.ceil((b.precio_base_aereo * (1 + porcentaje) / 1000)) * 1000,
            item_descripcion: b.nombre.toUpperCase(),
            item_referencia: b.referencia.toUpperCase(),
            item_unidad_medida: b.unidad_medida_catalogo,
            id_item: b.id,
            forma_pago_id: forma_pago && forma_pago.id,
            costo_cop: b.costo_cop,
            costo_cop_aereo: b.costo_cop_aereo,
            origen: `Catalogo ${b.origen}`,
        }));
        todos_los_items = _.orderBy([...bandas_eurobelt, ...componentes_eurobelt, ...articulos_catalogos], ['item_descripcion'], ['asc']);
    }

    const consultarItems = () => {
        if (con_bandas) {
            dispatch(actions.fetchBandasEurobeltxParametro(busqueda));
        }
        if (con_componentes) {
            dispatch(actions.fetchBandaEurobeltComponentesxParametro(busqueda));
        }
        if (con_articulos_venta_catalogo) {
            dispatch(actions.fetchItemsVentasCatalogosxParametro(busqueda));
        }
    };
    return (
        <div className='row'>
            {con_precios && <div className="col-12 col-md-3 col-xl-2">
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
            </div>}
            {(forma_pago || (con_costos && !con_precios)) &&
            <Fragment>
                <div className="col-12 col-md-7 col-xl-7">
                    <TextField
                        fullWidth={true}
                        label='Busqueda'
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="col-12 col-md-2 col-xl-3">
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
                    <ListaPrecioTabla
                        con_costos={con_costos}
                        con_precios={con_precios}
                        items={todos_los_items}
                        adicionarItem={adicionarItem}

                    />
                </div>
            </Fragment>
            }
        </div>
    )
});
ListaPrecio.propTypes = {
    adicionarItem: PropTypes.func,
    con_costos: PropTypes.bool,
    con_precios: PropTypes.bool,
    con_bandas: PropTypes.bool,
    con_componentes: PropTypes.bool,
    con_articulos_venta_catalogo: PropTypes.bool,
};


export default ListaPrecio;