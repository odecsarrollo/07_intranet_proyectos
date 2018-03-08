import React, {Component} from 'react';
import {pesosColombianos} from '../../../../../../00_utilities/common';
import {ListaBusqueda} from '../../../../../../00_utilities/utiles';
import TablaProyectoLiteralesMateriales from './proyectos_literales_materiales_tabla';

const ProyectoLiteralDetail = (props) => {
    const {
        literal,
        items_literales,
        permisos
    } = props;
    if (!literal || !items_literales) {
        return (<div>Cargando ...</div>)
    }
    return (
        <div className="row">
            <div className="col-12">
                <h4 className="h4-responsive">Literal: <small>{literal.id_literal}</small></h4>
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-12">
                        <h5 className='h5-response'>{literal.descripcion}</h5>
                    </div>
                    {
                        permisos.costo_materiales &&
                        <div className="col-12">
                            <h6 className='h6-response'>Costo
                                Materiales: <small>{pesosColombianos(literal.costo_materiales)}</small>
                            </h6>
                        </div>
                    }
                    {permisos.costo_mano_obra &&
                    <div className="col-12">
                        <h6 className='h6-response'>Costo
                            Mano
                            Obra: <small>{pesosColombianos(literal.costo_mano_obra)}</small>
                        </h6>
                    </div>
                    }
                    {
                        permisos.costo &&
                        <div className="col-12">
                            <h6 className='h6-response'>Costo
                                Total: <small>{pesosColombianos(Number(literal.costo_mano_obra) + Number(literal.costo_materiales))}</small>
                            </h6>
                        </div>
                    }
                    <div className="col-12">
                        <TablaProyectoLiteralesMateriales
                            items_literales={items_literales}
                            can_see_ultimo_costo_item_biable={permisos.ultimo_costo_item_biable}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};
export default ProyectoLiteralDetail;