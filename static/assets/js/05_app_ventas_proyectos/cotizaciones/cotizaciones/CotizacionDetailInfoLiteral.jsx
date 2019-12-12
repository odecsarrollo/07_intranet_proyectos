import React, {useState} from 'react';
import * as actions from "../../../01_actions/01_index";
import {useSelector} from "react-redux/es/hooks/useSelector";
import DialogSeleccionar from "../../../00_utilities/components/ui/search_and_select/SearchAndSelect";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import {Link} from "react-router-dom";
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";

const CotizacionDetailInfoLiteral = (props) => {
    const dispatch = useDispatch();
    const {cotizacion, cotizacion: {literales}, permisos_cotizacion} = props;
    const [relacionar_literal, setRelacionarLiteral] = useState(false);
    const relacionarQuitarLiteral = (proyecto_id) => dispatch(actions.relacionarQuitarLiteralCotizacion(cotizacion.id, proyecto_id));
    const buscarLiteral = (busqueda) => {
        dispatch(actions.fetchLiteralesxParametro(busqueda));
    };
    let literales_list = useSelector(state => state.literales);
    literales_list = _.pickBy(literales_list, p => !literales.map(e => e.id).includes(p.id));
    return (
        <div style={{
            borderRadius: '5px',
            border: 'solid black 1px',
            padding: '5px',
            marginBottom: '10px'
        }}>
            <strong>Literales : </strong>
            {permisos_cotizacion.rel_cotizacion_adicional_a_literal &&
            <span
                className='puntero'
                style={{color: 'red'}}
                onClick={() => setRelacionarLiteral(true)}
            >
                Relacionar
            </span>}
            <div className="col-12">
                {literales.length > 0 && <div className="row">
                    {literales.map(l => <div key={l.id} className='col-6 col-sm-4 col-md-3'>
                        <Link to={`/app/proyectos/proyectos/detail/${l.proyecto_id}`}>
                            {l.id_literal}
                        </Link>
                        <MyDialogButtonDelete
                            style={{position: 'absolute', left: '80px', top: '0'}}
                            element_name={''}
                            element_type={`la relación de la cotizacion con el literal ${l.id_literal}`}
                            onDelete={() => relacionarQuitarLiteral(l.id)}
                        />
                    </div>)}
                </div>}
            </div>
            {relacionar_literal &&
            <DialogSeleccionar
                placeholder='Literal a buscar'
                id_text='id'
                selected_item_text='id_literal'
                onSearch={buscarLiteral}
                onSelect={relacionarQuitarLiteral}
                onCancelar={() => setRelacionarLiteral(false)}
                listado={_.map(literales_list)}
                open={relacionar_literal}
                select_boton_text='Relacionar'
                titulo_modal={'Relacionar Literal'}
            />}
        </div>
    )
};

export default CotizacionDetailInfoLiteral;