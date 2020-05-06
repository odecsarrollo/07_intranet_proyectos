import React, {memo, useState, Fragment} from "react";
import CotizacionDetailAddItemNoListaPrecio from "./CotizacionDetailAddItemNoListaPrecio";
import ListaPrecio from '../../lista_precios/ListaPrecio'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Button from '@material-ui/core/Button';
import * as actions from "../../../01_actions/01_index";
import {useDispatch} from "react-redux";
import DialogListaPrecio from "../../lista_precios/DialogListaPrecios";

const CotizadorAdicionarItem = memo(props => {
    const [show_adicionar_item, setShowAdicionarItem] = useState(false);
    const {cotizacion_componente} = props;
    const dispatch = useDispatch();
    const cerrarDialog = () => setShowAdicionarItem(false);
    const adicionarItem = (
        tipo_item,
        precio_unitario,
        item_descripcion,
        item_referencia,
        item_unidad_medida,
        tipo_transporte = 'NO APLICA',
        tasa,
        moneda_origen,
        moneda_origen_costo,
        item_id = null,
        forma_pago_id = null,
        callback = null
    ) => {
        dispatch(
            actions.adicionarItemCotizacionComponente(
                cotizacion_componente.id,
                tipo_item,
                precio_unitario,
                item_descripcion,
                item_referencia,
                item_unidad_medida,
                tipo_transporte,
                tasa,
                moneda_origen,
                moneda_origen_costo,
                item_id,
                forma_pago_id,
                {callback}
            )
        )
    };
    return (
        <Fragment>
            <FontAwesomeIcon
                className='puntero'
                icon='plus-circle'
                onClick={() => setShowAdicionarItem(true)}
            />
            {show_adicionar_item &&
            <Dialog
                fullScreen={true}
                open={show_adicionar_item}
            >
                <DialogTitle id="responsive-dialog-title">
                    Adicionar Item
                </DialogTitle>
                <DialogContent>
                    <Tabs>
                        <TabList>
                            <Tab>Lista Precios</Tab>
                            <Tab>Item Personalizado</Tab>
                        </TabList>
                        <TabPanel>
                            <ListaPrecio
                                moneda={cotizacion_componente.moneda}
                                con_precios={true}
                                con_costos={false}
                                adicionarItem={adicionarItem}
                            />
                        </TabPanel>
                        <TabPanel>
                            <CotizacionDetailAddItemNoListaPrecio
                                adicionarItem={adicionarItem}
                                cerrarDialog={cerrarDialog}
                            />
                        </TabPanel>
                    </Tabs>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        variant="contained"
                        className='ml-3'
                        onClick={() => setShowAdicionarItem(false)}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            }
        </Fragment>
    )
});

export default CotizadorAdicionarItem;