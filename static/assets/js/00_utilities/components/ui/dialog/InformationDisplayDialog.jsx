import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";

const InformationDisplayDialog = (props) => {
    const {
        is_open,
        onCerrar,
        cerrar_text,
        titulo_text,
        fullScreen = false,
        fullWidth = false,
        context_text = 'Cerrar',
        children,
    } = props;
    return (
        <Dialog open={is_open} fullScreen={fullScreen} fullWidth={fullWidth}>
            {titulo_text && <DialogTitle id="responsive-dialog-title">{titulo_text}</DialogTitle>}
            <DialogContent>
                {context_text && <DialogContentText>{context_text}</DialogContentText>}
                {children}
            </DialogContent>
            <DialogActions>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={onCerrar}
                >
                    {cerrar_text}
                </Button>
            </DialogActions>
        </Dialog>
    )
};
InformationDisplayDialog.propTypes = {
    is_open: PropTypes.bool.isRequired,
    fullWidth: PropTypes.bool,
    fullScreen: PropTypes.bool,
    cerrar_text: PropTypes.string,
    titulo_text: PropTypes.string,
    context_text: PropTypes.string,
    onCerrar: PropTypes.func.isRequired,
};

export default InformationDisplayDialog;