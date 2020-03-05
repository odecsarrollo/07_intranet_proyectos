import React, {Fragment, memo, useEffect, useState} from 'react';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import PropTypes from "prop-types";
import DetailInfoItem from "../detail_layout/DetailInfoItem";

const ItemSeleccion = memo(props => {
    const [seleccionado, setSeleccionado] = useState(false);
    const {onSelect, select_boton_text = 'Seleccionar', selected_item_text, item_id} = props;
    return (
        <div className='col-6 col-sm-4 col-md-3 text-center'
             style={{border: seleccionado ? '1px solid red' : ''}}>
                <span className='puntero'
                      onClick={() => setSeleccionado(!seleccionado)}
                >
                    {selected_item_text}
                </span>
            {
                seleccionado &&
                <Fragment>
                    <div style={{color: 'orange'}}>
                        <div>
                            <Button
                                className='mb-2'
                                color="primary"
                                variant="contained"
                                onClick={() => onSelect(item_id)}
                            >
                                {select_boton_text}
                            </Button>

                        </div>
                    </div>
                </Fragment>
            }
        </div>
    )
});

const DialogSeleccionar = memo(props => {
    const {
        open,
        id_text = 'id',
        min_caracteres = 5,
        onSelect,
        onSearch = null,
        placeholder = 'Colocar Place Holder',
        exclude_ids = [],
        onCancelar = null,
        selected_item_text = 'nombre',
        select_boton_text,
        titulo_modal = 'Colocar título a modal',
        onUnMount = null,
        onMount = null,
    } = props;
    let {listado = []} = props;
    if (exclude_ids.length > 0) {
        listado = listado.filter(e => !exclude_ids.includes(e[id_text]));
    }
    useEffect(() => {
        if (onMount) {
            onMount()
        }
        return () => {
            if (onUnMount) {
                onUnMount();
            }
        }
    }, []);
    const [campo_busqueda, setCampoBusqueda] = useState('');
    const buscarProyecto = (busqueda) => onSearch(busqueda);
    return (
        <Dialog
            open={open}
        >
            <DialogTitle id="responsive-dialog-title">
                {titulo_modal}
            </DialogTitle>
            <DialogContent>
                <TextField
                    id="text-field-controlled"
                    placeholder={placeholder}
                    value={campo_busqueda}
                    onChange={(v) => setCampoBusqueda(v.target.value)}
                />
                {
                    campo_busqueda.length > min_caracteres &&
                    <Fragment>
                        {onSearch && <Button
                            color="primary"
                            variant="contained"
                            onClick={() => buscarProyecto(campo_busqueda)}
                            className='ml-3'
                        >
                            Buscar
                        </Button>}
                        {listado && <div className="row" style={{width: '600px'}}>
                            {listado.map(e => {
                                return (
                                    <ItemSeleccion
                                        key={e[id_text]}
                                        item_id={e[id_text]}
                                        onSelect={onSelect}
                                        selected_item_text={e[selected_item_text]}
                                        select_boton_text={select_boton_text}
                                    />
                                )
                            })}
                        </div>
                        }
                    </Fragment>
                }
            </DialogContent>
            <DialogActions>
                {onCancelar && <Button
                    color="secondary"
                    variant="contained"
                    onClick={onCancelar}
                >
                    Cancelar
                </Button>}
            </DialogActions>
        </Dialog>
    )

});

DialogSeleccionar.propTypes = {
    min_caracteres: PropTypes.number,
    placeholder: PropTypes.string.isRequired,
    selected_item_text: PropTypes.string,
    id_text: PropTypes.string,
    select_boton_text: PropTypes.string,
    titulo_modal: PropTypes.string,
    onUnMount: PropTypes.func,
    onMount: PropTypes.func,
    exclude_ids: PropTypes.array,
    onSearch: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    onCancelar: PropTypes.func.isRequired,
    listado: PropTypes.array.isRequired,
};

export default DialogSeleccionar;