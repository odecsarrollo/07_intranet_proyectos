import React, {memo, useState, Fragment} from "react";
import CotizacionDetailAddItemNoListaPrecio from "./CotizacionDetailAddItemNoListaPrecio";
import CotizadorListaPrecio from './CotizadorListaPrecio'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Button from '@material-ui/core/Button';

const CotizadorAdicionarItem = memo(props => {
    const [show_adicionar_item, setShowAdicionarItem] = useState(false);
    const {adicionarItem} = props;
    const cerrarDialog = () => setShowAdicionarItem(false);
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
                            <CotizadorListaPrecio
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