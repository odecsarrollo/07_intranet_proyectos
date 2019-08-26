import React, {memo} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const CotizacionDetailAdjuntoList = memo(props => {
    const {adjuntos} = props;
    const imagenes = _.pickBy(adjuntos, a => a.imagen);
    const archivos = _.pickBy(adjuntos, a => !a.imagen);
    return <div className='row'>
        {_.map(imagenes, i =>
            <div className="col-2 p-2 text-center" key={i.id}>
                <picture>
                    <img src={i.imagen_thumbnail}/>
                </picture>
                <span>{i.nombre_adjunto}</span>
            </div>
        )}
        {_.map(archivos, i =>
            <div className="col-2 p-2 text-center" key={i.id}>
                <div className='text-center'>
                    <FontAwesomeIcon
                        icon={'file'}
                        size='8x'
                    />
                    <div>{i.nombre_adjunto}</div>
                    <div style={{
                        color: 'white',
                        position: 'relative',
                        top: '-60px',
                        fontSize: '20px'
                    }}>.{i.extension}</div>
                </div>
            </div>
        )}</div>
});

export default CotizacionDetailAdjuntoList;