import React, {Fragment} from 'react';

const ProyectoBoxItem = (props) => {
    const {id_literal, id, descripcion} = props.item;
    return (
        <Fragment>
            <div className='col-10 col-lg-11'
                 style={{color: 'gray'}}>{id_literal} {descripcion}
            </div>
            <div className="col-2 col-lg-1">
                <i className="fas fa-minus puntero"
                   onClick={() => props.modificarAutorizacionProyecto(id, 'delete')}></i>
            </div>
        </Fragment>
    )
};

const ProyectoBox = (props) => {
    return (
        <div className='col-12 col-md-6 p-1'>
            <div className='p-1' style={{border: 'solid 1px gray'}}>
                <div className='text-center'>
                    <strong>{props.proyecto.id_proyecto}</strong>
                </div>
                <div className='row'>
                    {_.orderBy(props.proyecto.literales,['id_literal']).map(l => {
                        return <ProyectoBoxItem
                            key={l.id_literal}
                            item={l}
                            modificarAutorizacionProyecto={props.modificarAutorizacionProyecto}
                        />
                    })}
                </div>
            </div>
        </div>
    )
};

export default ProyectoBox;