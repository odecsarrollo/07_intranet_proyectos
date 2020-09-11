import React, {useState} from 'react';
import * as actions from "../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import DialogSeleccionar from "../../../00_utilities/components/ui/search_and_select/SearchAndSelect";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import {Link} from "react-router-dom";
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";

const CotizacionDetailInfoProyecto = (props) => {
    const dispatch = useDispatch();
    const {cotizacion, cotizacion: {proyectos}, permisos_cotizacion} = props;
    const [relacionar_proyecto, setRelacionarProyecto] = useState(false);
    const [proyectos_list, setListadoProyectos] = useState([]);

    const relacionarQuitarProyecto = (proyecto_id) => dispatch(actions.relacionarQuitarProyectoaCotizacion(cotizacion.id, proyecto_id));
    const buscarProyecto = (busqueda) => {
        dispatch(actions.fetchProyectosxParametro(busqueda, {
            callback: (response) => {
                setListadoProyectos(response);
            }
        }));
    };
    return (
        <div style={{
            borderRadius: '5px',
            border: 'solid black 1px',
            padding: '5px',
            marginBottom: '10px'
        }}>
            <strong>Proyectos: </strong>
            {permisos_cotizacion.rel_cotizacion_proyecto &&
            <span
                className='puntero'
                style={{color: 'red'}}
                onClick={() => setRelacionarProyecto(true)}
            >
                Relacionar
            </span>}
            <div className="col-12">
                {proyectos !== undefined && proyectos.length > 0 && <div className='row'>
                    {_.orderBy(proyectos, ['id_proyecto', 'asc']).map(p => <div
                        key={p.id}
                        style={{position: 'relative'}}
                        className='col-6 col-sm-4 col-md-3'
                    >
                        <Link
                            to={`/app/proyectos/proyectos/detail/${p.id}`}>{p.id_proyecto}
                        </Link>
                        <MyDialogButtonDelete
                            style={{position: 'absolute', left: '80px', top: '0'}}
                            element_name={''}
                            element_type={`la relación de la cotizacion con el proyecto ${p.id_proyecto}`}
                            onDelete={() => relacionarQuitarProyecto(p.id)}
                        />
                    </div>)}
                </div>}
            </div>
            {relacionar_proyecto && <DialogSeleccionar
                placeholder='Proyecto a buscar'
                id_text='id'
                selected_item_text='id_proyecto'
                onSearch={buscarProyecto}
                onSelect={relacionarQuitarProyecto}
                onCancelar={() => setRelacionarProyecto(false)}
                listado={_.map(_.pickBy(proyectos_list, pl => !proyectos.map(e => e.id).includes(pl.id)))}
                open={relacionar_proyecto}
                select_boton_text='Relacionar'
                titulo_modal={'Relacionar Proyecto'}
            />}
        </div>
    )
};

export default CotizacionDetailInfoProyecto;