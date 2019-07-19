import React, {memo, Fragment, useState} from 'react';
import {fechaHoraFormatoUno, formatBytes} from "../../../../../00_utilities/common";
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import IconButton from "@material-ui/core/IconButton";

const CobroCRUDFormEnvioTablaItem = memo(props => {
    const {
        created,
        version,
        extension,
        tamano,
        creado_por_username,
        style,
        archivo_url
    } = props;
    return (
        <tr style={style.tabla.tr}>
            <td style={style.tabla.tr.td}>{fechaHoraFormatoUno(created)}</td>
            <td style={style.tabla.tr.td}>{extension}</td>
            <td style={style.tabla.tr.td}>{formatBytes(tamano, 1)}</td>
            <td style={style.tabla.tr.td}>{creado_por_username}</td>
            <td style={style.tabla.tr.td_numero}>{version}</td>
            <td style={{padding: '2px'}} className='text-center'>
                <a href={archivo_url}>
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

const styles = {
    texto_ver: {
        fontSize: '0.7rem',
        color: 'black'
    }
};

const CobroCRUDFormEnvioTabla = memo(props => {
    const {envios, style} = props;
    const [mostrar, setMostrar] = useState(false);
    if (envios.length <= 0) {
        return <Fragment></Fragment>
    }
    return (
        <div className="col-12">
            <Typography variant="h5" gutterBottom color="primary">
                Bitacora Envíos <span className='puntero'
                                      style={styles.texto_ver}
                                      onClick={() => setMostrar(!mostrar)}>({!mostrar ? 'Ver' : 'Ocultar'})</span>
            </Typography>
            {
                mostrar &&
                <table className='table table-responsive table-striped' style={style.tabla}>
                    <thead>
                    <tr style={style.tabla.tr}>
                        <th style={style.tabla.tr.th}>Fecha Envio</th>
                        <th style={style.tabla.tr.th}>Extensión</th>
                        <th style={style.tabla.tr.th}>Tamaño</th>
                        <th style={style.tabla.tr.th}>Usuario</th>
                        <th style={style.tabla.tr.th_numero}>Version</th>
                        <th style={style.tabla.tr.th}>link</th>
                    </tr>
                    </thead>
                    <tbody>
                    {envios.map(e => {
                        if (e.id) {
                            return (
                                <CobroCRUDFormEnvioTablaItem
                                    style={style}
                                    key={e.id}
                                    extension={e.extension.toUpperCase()}
                                    tamano={e.size}
                                    created={e.created}
                                    version={e.version}
                                    archivo_url={e.archivo_url}
                                    creado_por_username={e.creado_por_username}
                                />
                            )
                        }
                    })}
                    </tbody>
                </table>
            }
        </div>
    )
});

export default CobroCRUDFormEnvioTabla;