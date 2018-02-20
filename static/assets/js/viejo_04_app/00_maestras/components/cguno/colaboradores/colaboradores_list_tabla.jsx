import React from 'react';
import PropTypes from "prop-types";
import {tengoPermiso} from './../../../../../01_actions/00_general_fuctions';

const ItemTabla = (props) => {
    const {
        item,
        onUpdate,
        can_change,
        onSelectItem,
        onCreateColaboradorUsuario,
        onCambiarActivacion
    } = props;
    const en_proyectos_icon = item.en_proyectos ? 'fas fa-check-square' : 'far fa-square';
    const usuario_activo_icon = item.usuario_activo ? 'fas fa-check-square' : 'far fa-square';
    const autogestion_horas_trabajadas_icon = item.autogestion_horas_trabajadas ? 'fas fa-check-square' : 'far fa-square';
    return (
        <tr>
            <td>{item.cedula}</td>
            <td>{item.nombres}</td>
            <td>{item.apellidos}</td>
            <td>{!item.usuario ?
                <div>
                    <span>Crear Usuario </span>
                    <i onClick={() => onCreateColaboradorUsuario(item)} className="fas fa-plus puntero">
                    </i>
                </div> :
                <div>
                    <div>{item.usuario_username} </div>
                    <div>
                        <span>Activo </span>
                        <i className={`${usuario_activo_icon} puntero`} onClick={() => {
                            onCambiarActivacion(item)
                        }}>
                        </i>
                    </div>
                </div>

            }</td>
            <td className='text-center'>{item.es_cguno && <i className="fas fa-check"></i>}</td>
            <td className='text-center'>
                <i onClick={() => onUpdate({...item, en_proyectos: !item.en_proyectos})}
                   className={`${en_proyectos_icon} puntero`}>
                </i>
            </td>
            <td className='text-center'>
                {
                    item.usuario_username &&
                    item.usuario_activo &&
                    <i onClick={() => onUpdate({
                        ...item,
                        autogestion_horas_trabajadas: !item.autogestion_horas_trabajadas
                    })}
                       className={`${autogestion_horas_trabajadas_icon} puntero`}>
                    </i>
                }
            </td>
            {
                can_change &&
                <td className='text-center'>
                    {
                        !item.es_cguno &&
                        <i className="fas fa-edit puntero"
                           style={{cursor: "pointer"}}
                           onClick={() => onSelectItem(item)}
                        >
                        </i>
                    }
                </td>
            }
        </tr>
    )
};

ItemTabla.propTypes = {
    item: PropTypes.object
};

export const ColaboradoresCGUNO = (props) => {
    const {mis_permisos} = props;
    const can_change = tengoPermiso(mis_permisos, 'change_colaboradorbiable');
    return (
        <table className="table table-responsive table-striped tabla-maestra">
            <thead>
            <tr>
                <th>Cédula</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Usuario</th>
                <th>En CGUno</th>
                <th>En Proyectos</th>
                <th>Autogestión Horas</th>
                {can_change && <th>Editar</th>}
            </tr>
            </thead>
            <tbody>
            {_.map(props.lista, item => {
                return <ItemTabla key={item.cedula} can_change={can_change}
                                  item={item} {...props}/>
            })}
            </tbody>
            <tfoot>

            </tfoot>
        </table>
    )
};

ColaboradoresCGUNO.propTypes = {
    lista: PropTypes.any.isRequired,
    mis_permisos: PropTypes.any.isRequired
};

export default ColaboradoresCGUNO