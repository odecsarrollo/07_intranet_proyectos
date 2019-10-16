import React, {Fragment, memo, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as actions from "../../../../01_actions/01_index";

const Item = memo(props => {
    const [literal_id_seleccionado, setLiteralIdSeleccionado] = useState(false);
    const {
        onRelacionar,
        nombre,
        id
    } = props;
    return (
        <div className='col-3 text-center' style={{border: literal_id_seleccionado ? '1px solid red' : ''}}>
                <span className='puntero'
                      onClick={() => {
                          setLiteralIdSeleccionado(id)
                      }}
                >
                    {nombre}
                </span>
            {
                literal_id_seleccionado &&
                <Fragment>
                    <div style={{color: 'orange'}}>
                        <div>
                            <Button
                                className='mb-2'
                                color="primary"
                                variant="contained"
                                onClick={() => onRelacionar(id)}
                            >
                                Relacionar
                            </Button>

                        </div>
                    </div>
                </Fragment>
            }
        </div>
    )
});

const PanelRelacionarLiteral = memo(props => {
    const dispatch = useDispatch();
    const [campo_busqueda, setCampoBusqueda] = useState('');
    const {onRelacionar} = props;

    const buscarLiteral = (busqueda) => {
        dispatch(actions.fetchLiteralesxParametro(busqueda));
    };

    let literales = useSelector(state => state.literales);
    literales = _.map(_.orderBy(literales, ['id_literal'], ['asc']));


    return (
        <Fragment>
            <TextField
                id="text-field-controlled"
                placeholder={'Literal a buscar'}
                autoComplete='off'
                value={campo_busqueda}
                onChange={(v) => setCampoBusqueda(v.target.value)}
            />
            {
                campo_busqueda.length > 5 &&
                <Fragment>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => buscarLiteral(campo_busqueda)}
                        className='ml-3'
                    >
                        Buscar
                    </Button>
                    <div className="row">
                        {literales.map(e => {
                            return (
                                <Item
                                    key={e.id}
                                    id={e.id}
                                    nombre={e.id_literal}
                                    onRelacionar={onRelacionar}
                                />
                            )
                        })}
                    </div>
                </Fragment>
            }
        </Fragment>
    )
});

export default PanelRelacionarLiteral;