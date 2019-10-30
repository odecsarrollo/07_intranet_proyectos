import React from 'react';
import {fechaFormatoUno} from "../../../00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import ProyectoDetailCotizacionesInfo from './ProyectoDetailInfoCotizacionesTable';

const InfoProyecto = (props) => {
    const {proyecto} = props;
    return (
        <div className="row">
            <div className="col-12">
                <span><strong>Nombre: </strong><small>{proyecto.nombre}</small></span>
            </div>
            {proyecto.cliente &&
            <div className="col-12">
                <span><strong>Cliente: </strong><small>{proyecto.cliente_nombre}</small></span>
            </div>}
            <div className="col-12 col-md-6 col-lg-3">
                    <span><strong>Sincronizado: </strong>
                        <FontAwesomeIcon
                            icon={proyecto.en_cguno ? 'check' : 'times'}
                        />
                    </span>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
                                <span><strong>Abierto: </strong>
                                    <FontAwesomeIcon
                                        icon={proyecto.abierto ? 'check' : 'times'}
                                    />
                                </span>
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-12 col-md-6">
                                        <span><strong>Fecha Pactada Entrega: </strong><small>
                                            {
                                                proyecto.fecha_entrega_pactada ? fechaFormatoUno(proyecto.fecha_entrega_pactada) : 'Sin Definir'
                                            }
                                        </small></span>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-12 col-lg-3">
                        <ProyectoDetailCotizacionesInfo proyecto={proyecto}/>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default InfoProyecto;