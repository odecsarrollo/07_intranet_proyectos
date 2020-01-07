import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from "moment-timezone";

const DistribucionHoraHojaTrabajoDialog = (props) => {
    const {open, onCancel, onSubmit} = props;
    const [fecha, setFecha] = useState(new Date());
    const [colaborador, setColaborador] = useState(null);
    const [ops, setOps] = useState(['Uno', 'Dos', 'Tres']);
    const horas = [
        {label: '05:00 am - 05:30 am', name_field: 'am0500_am0530'},
        {label: '05:30 am - 06:00 am', name_field: 'am0530_am0600'},
        {label: '06:00 am - 06:30 am', name_field: 'am0600_am0630'},
        {label: '06:30 am - 07:00 am', name_field: 'am0630_am0700'},
        {label: '07:00 am - 07:30 am', name_field: 'am0700_am0730'},
        {label: '07:30 am - 08:00 am', name_field: 'am0730_am0800'},
        {label: '08:00 am - 08:30 am', name_field: 'am0800_am0830'},
        {label: '08:30 am - 09:00 am', name_field: 'am0830_am0900'},
        {label: '09:00 am - 09:30 am', name_field: 'am0900_am0930'},
        {label: '09:30 am - 10:00 am', name_field: 'am0930_am1000'},
        {label: '10:00 am - 10:30 am', name_field: 'am1000_am1030'},
        {label: '10:30 am - 11:00 am', name_field: 'am1030_am1100'},
        {label: '11:00 am - 11:30 am', name_field: 'am1100_am1130'},
        {label: '11:30 am - 12:00 pm', name_field: 'am1130_pm1200'},
        {label: '12:00 pm - 12:30 pm', name_field: 'pm1200_pm1230'},
        {label: '12:30 pm - 01:00 pm', name_field: 'pm1230_pm1300'},
        {label: '01:00 pm - 01:30 pm', name_field: 'pm1300_pm1330'},
        {label: '01:30 pm - 02:00 pm', name_field: 'pm1330_pm1400'},
        {label: '02:00 pm - 02:30 pm', name_field: 'pm1400_pm1430'},
        {label: '02:30 pm - 03:00 pm', name_field: 'pm1430_pm1500'},
        {label: '03:00 pm - 03:30 pm', name_field: 'pm1500_pm1530'},
        {label: '03:30 pm - 04:00 pm', name_field: 'pm1530_pm1600'},
        {label: '04:00 pm - 04:30 pm', name_field: 'pm1600_pm1630'},
        {label: '04:30 pm - 05:00 pm', name_field: 'pm1630_pm1700'},
        {label: '05:00 pm - 05:30 pm', name_field: 'pm1700_pm1730'},
        {label: '05:30 pm - 06:00 pm', name_field: 'pm1730_pm1800'},
        {label: '06:00 pm - 06:30 pm', name_field: 'pm1800_pm1830'},
        {label: '06:30 pm - 07:00 pm', name_field: 'pm1830_pm1900'},
        {label: '07:00 pm - 07:30 pm', name_field: 'pm1900_pm1930'},
        {label: '07:30 pm - 08:00 pm', name_field: 'pm1930_pm2000'},
        {label: '08:00 pm - 08:30 pm', name_field: 'pm2000_pm2030'},
        {label: '08:30 pm - 09:00 pm', name_field: 'pm2030_pm2100'},
        {label: '09:00 pm - 09:30 pm', name_field: 'pm2100_pm2130'},
        {label: '09:30 pm - 10:00 pm', name_field: 'pm2130_pm2200'},
        {label: '10:00 pm - 10:30 pm', name_field: 'pm2200_pm2230'},
        {label: '10:30 pm - 11:00 pm', name_field: 'pm2230_pm2300'},
        {label: '11:00 pm - 11:30 pm', name_field: 'pm2300_pm2330'},
        {label: '11:30 pm - 12:00 am', name_field: 'pm2330_am2400'},
        {label: '12:00 am - 12:30 pm', name_field: 'am2400_am2430'},
        {label: '12:30 am - 01:00 pm', name_field: 'am2430_am0100'},
        {label: '01:00 am - 01:30 pm', name_field: 'am0100_am0130'},
    ];
    return <Dialog
        open={open}
        fullScreen={true}
    >
        <DialogTitle id="responsive-dialog-title">Prueba</DialogTitle>
        <DialogContent>
            <div className="row">
                <div className="col-12">
                    <DateTimePicker
                        onChange={(e, f) => {
                            setFecha(e)
                        }}
                        format="YYYY-MM-DD"
                        time={false}
                        max={new Date()}
                        value={moment(fecha).toDate()}
                    />
                </div>
            </div>
            <table className='table table-striped table-responsive'>
                <thead>
                <tr>
                    <th>Horas</th>
                    {ops.map(op => <th key={op}>{op}</th>)}
                </tr>
                </thead>
                <tbody>
                {horas.map(h => <tr>
                    <td>{h.label}</td>
                    {ops.map(op => <td key={op}>siii</td>)}
                </tr>)}
                </tbody>
            </table>
            <DialogContentText>

            </DialogContentText>
        </DialogContent>
        <DialogActions>
            {onCancel && <Button
                color="secondary"
                variant="contained"
                onClick={onCancel}
            >
                Cancelar
            </Button>}
            {onSubmit && <Button
                color="primary"
                variant="contained"
                type='submit'
                onClick={onSubmit}
            >
                Guardar
            </Button>}
        </DialogActions>
    </Dialog>
};
export default DistribucionHoraHojaTrabajoDialog;