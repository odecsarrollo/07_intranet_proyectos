import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import ListaPrecio from "./ListaPrecio";
import DialogTitle from "@material-ui/core/DialogTitle";

const DialogListaPrecio = (props) => {
    const {is_open, handleCloseModal} = props;
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
            <ListaPrecio/>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseModal}>
                Cerrar
            </Button>
        </DialogActions>
    </Dialog>
};

export default DialogListaPrecio;