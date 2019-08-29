import React, {memo} from 'react';
import {fechaHoraFormatoUno, formatBytes} from "../../../00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";

const CotizacionDetailEnvioListItem = memo(props => {
    const correos_to_array = props.item.correos_to.toLowerCase().split(',');
    return (
        <tr>
            <td style={{padding: '4px'}}>{props.item.archivo_name}</td>
            <td style={{padding: '4px', textAlign: 'center'}}>{props.item.archivo_version}</td>
            <td style={{padding: '4px'}}>.{props.item.extension.toUpperCase()}</td>
            <td style={{padding: '4px'}}>{formatBytes(props.item.size, 1)}</td>
            <td style={{padding: '4px'}}>{fechaHoraFormatoUno(props.item.created)}</td>
            <td style={{padding: '4px'}}>{props.item.creado_por_username}</td>
            <td style={{padding: '4px'}}>{props.item.correo_from.toLowerCase()}</td>
            <td style={{padding: '4px'}}>{correos_to_array.map(e => <div key={e}>{e}</div>)}</td>
            <td style={{padding: '2px'}} className='text-center'>
                <a href={props.item.archivo_url} target="_blank">
                    <IconButton
                        style={{
                            margin: 0,
                            padding: 4,
                        }}
                    >
                        <FontAwesomeIcon
                            className='puntero'
                            icon='download'
                            size='xs'
                        />
                    </IconButton>
                </a>
            </td>
        </tr>
    )
});

const CotizacionDetailEnvioList = memo(props => {
    const {lista, modal_open, onClose} = props;
    return (
        <Dialog open={modal_open} fullScreen={true}>
            <DialogTitle id="customized-dialog-title">
                Histórico de Envíos de Cotización
            </DialogTitle>
            <DialogContent>
                <table className='table table-responsive table-striped' style={{fontSize: '11px'}}>
                    <thead>
                    <tr>
                        <th style={{padding: '2px'}}>Nombre</th>
                        <th style={{padding: '2px'}}>Versión</th>
                        <th style={{padding: '2px'}}>Extensión</th>
                        <th style={{padding: '2px'}}>Tamaño</th>
                        <th style={{padding: '2px'}}>Fecha</th>
                        <th style={{padding: '2px'}}>Usuario</th>
                        <th style={{padding: '2px'}}>Correo From</th>
                        <th style={{
                            fontSize: '0.6rem',
                            padding: '2px',
                        }}>Correo To
                        </th>
                        <th style={{padding: '2px'}}>Link</th>
                    </tr>
                    </thead>
                    <tbody>
                    {_.map(lista, e =>
                        <CotizacionDetailEnvioListItem
                            item={e}
                            key={e.id}
                        />)}
                    </tbody>
                </table>
            </DialogContent>
            <DialogActions>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={onClose}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    )
});

export default CotizacionDetailEnvioList;