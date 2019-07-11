import React, {memo, useState} from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import moment from "moment-timezone";
import DateTimePicker from "react-widgets/lib/DateTimePicker";


const PagoModal = memo(props => {
    const now = moment().tz('America/Bogota');
    const {onCobrada, is_open, onCerrar, fecha_minima} = props;
    const [fecha_cobro, setFechaCobro] = useState(now.toDate());
    return <Dialog
        fullScreen={false}
        open={is_open}
    >
        <DialogTitle id="responsive-dialog-title">
            Fecha de pago
        </DialogTitle>
        <DialogContent>
            <div style={{height: '350px', width: '300px'}}>
                <DateTimePicker
                    onChange={(e, s) => {
                        setFechaCobro(s);
                        onCerrar();
                    }}
                    format="YYYY-MM-DD"
                    time={false}
                    max={new Date()}
                    min={moment(fecha_minima).toDate()}
                    value={moment(fecha_cobro).toDate()}
                />
            </div>
        </DialogContent>
        <DialogActions>
            <Button
                color="secondary"
                variant="contained"
                className='ml-3'
                onClick={() => onCobrada(fecha_cobro)}
            >
                Cobrada
            </Button>
            <Button
                color="secondary"
                variant="contained"
                className='ml-3'
                onClick={() => onCerrar()}
            >
                Cancelar
            </Button>
        </DialogActions>
    </Dialog>
});
export default PagoModal;