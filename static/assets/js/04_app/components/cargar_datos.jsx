import React from 'react';

export default function CargarDatos(props) {
    const {cargarDatos} = props;
    return (
        <div
            className='boton-flotante'
            style={{cursor: "pointer"}}
            onClick={() => {
                cargarDatos();
            }}
        >
            <i className="fas fa-sync-alt fa-2x" aria-hidden="true"></i>
        </div>
    )
}