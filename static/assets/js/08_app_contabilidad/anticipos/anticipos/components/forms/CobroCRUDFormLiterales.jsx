import React, {memo, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import {useDispatch} from 'react-redux';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PanelRelacionarLiteral from "./CobroCRUDFormLiteralesRelacionarLiteral";
import * as actions from "../../../../../01_actions/01_index";

const style = {
    li: {
        fontSize: '0.7rem'
    }
};

const CobroCRUDFormLiteralesList = memo(props => {
    const {texto, cobro_id, literal_id} = props;
    const dispatch = useDispatch();
    const [mostra_eliminar, setMostarEliminar] = useState(false);
    const quitarLiteral = () => dispatch(actions.quitarRelacionLiteralProformaAnticipo(cobro_id, literal_id));
    return (
        <li style={style.li}>
            {texto}
            <FontAwesomeIcon
                className='puntero ml-2'
                icon={`${mostra_eliminar ? 'minus' : 'plus'}-circle`}
                onClick={() => setMostarEliminar(!mostra_eliminar)}
            />
            {
                mostra_eliminar &&
                <FontAwesomeIcon
                    className='puntero ml-5'
                    icon={'trash'}
                    onClick={quitarLiteral}
                />
            }
        </li>
    )
});

const CobroCRUDFormLiterales = memo(props => {
    const [mostrar_relacionar_literal, setMostrarRelacionarLiteral] = useState(false);
    const dispatch = useDispatch();
    const {cobro} = props;

    return (
        <div className="col-12">
            <div className="row">
                <div className="col-12">
                    <Typography variant="h5" gutterBottom color="primary">
                        Literales Relacionados
                        <FontAwesomeIcon
                            className='puntero'
                            icon={`${mostrar_relacionar_literal ? 'minus' : 'plus'}-circle`}
                            onClick={() => setMostrarRelacionarLiteral(!mostrar_relacionar_literal)}
                        />
                    </Typography>
                </div>
            </div>
            <div className="col-12">
                {
                    mostrar_relacionar_literal &&
                    <PanelRelacionarLiteral onRelacionar={(literal_id) => {
                        dispatch(actions.relacionarLiteralProformaAnticipo(cobro.id, literal_id));
                        setMostrarRelacionarLiteral(false)
                    }}/>
                }
                {
                    cobro.literales.length > 0 &&
                    <ol>
                        {cobro.literales.map(li => <CobroCRUDFormLiteralesList
                            texto={`${li.id_literal} - ${li.descripcion}`}
                            cobro_id={cobro.id}
                            literal_id={li.id}
                            key={li.id}/>
                        )}
                    </ol>
                }
            </div>
        </div>
    )
});

export default CobroCRUDFormLiterales;