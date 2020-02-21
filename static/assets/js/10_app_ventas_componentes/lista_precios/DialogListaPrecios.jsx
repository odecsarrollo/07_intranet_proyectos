import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import ListaPrecio from "./ListaPrecio";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";

const DialogListaPrecio = (props) => {
    const {
        is_open,
        handleCloseModal,
        con_articulos_venta_catalogo = true,
        con_bandas = true,
        con_componentes = true,
        con_costos = true,
        con_precios = true,
    } = props;
    return <Dialog
        fullScreen={true}
        open={is_open}
        fullWidth={true}
        maxWidth={'xl'}
    >
        <DialogTitle>
            <strong>Lista de precios</strong>
        </DialogTitle>
        <DialogContent>
            <ListaPrecio
                con_articulos_venta_catalogo={con_articulos_venta_catalogo}
                con_bandas={con_bandas}
                con_componentes={con_componentes}
                con_costos={con_costos}
                con_precios={con_precios}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseModal}>
                Cerrar
            </Button>
        </DialogActions>
    </Dialog>
};

DialogListaPrecio.propTypes = {
    con_costos: PropTypes.bool,
    con_precios: PropTypes.bool,
    con_bandas: PropTypes.bool,
    con_componentes: PropTypes.bool,
    con_articulos_venta_catalogo: PropTypes.bool,
};


export default DialogListaPrecio;