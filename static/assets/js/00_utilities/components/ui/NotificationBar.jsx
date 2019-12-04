import React, {useState, Fragment} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from "@material-ui/core/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const NotificationBar = props => {
    const [notificacion_open, setNotificacionOpen] = useState();
    return (
        <Fragment>
            {notificacion_open && <Dialog
                fullScreen={false}
                open={notificacion_open}
                scroll='paper'
            >
                <DialogTitle id="responsive-dialog-title">
                    Hola Titulo
                </DialogTitle>
                <DialogContent>
                    SI Si SI
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setNotificacionOpen(false)}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>}
            <FontAwesomeIcon
                onClick={() => setNotificacionOpen(true)}
                className='puntero'
                icon='thumbs-up'
                size='lg'
            />
        </Fragment>
    )
};

export default NotificationBar;