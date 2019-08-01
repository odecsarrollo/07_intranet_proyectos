import React, {memo, useEffect, useState} from 'react';
import * as actions from '../../../01_actions/01_index';
import {useSelector, useDispatch} from 'react-redux';
import ConfiguracionBandaEurobeltForm from './ConfiguracionBandaEurobeltForm';
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TextField from "@material-ui/core/TextField";

const TablaCostosItem = memo(props => {
    const dispatch = useDispatch();
    const [cambiar_porcentaje, setCambiarPorcentaje] = useState(false);
    const [porcentaje_item, setPorcentajeItem] = useState(false);
    const {item} = props;
    const cambiarPorcentaje = (porcentaje) => dispatch(actions.updateBandaEurobeltCostoEnsamblado(
        item.id,
        {
            ...item,
            porcentaje
        },
        {callback: () => setCambiarPorcentaje(false)}
    ));
    return <tr>
        <td>
            {item.con_aleta && <FontAwesomeIcon
                icon={'check-circle'}
            />}
        </td>
        <td>
            {item.con_empujador && <FontAwesomeIcon
                icon={'check-circle'}
            />}
        </td>
        <td>
            {item.con_torneado && <FontAwesomeIcon
                icon={'check-circle'}
            />}
        </td>
        <td><span className='puntero' onClick={() => {
            setCambiarPorcentaje(true);
            setPorcentajeItem(item.porcentaje);
        }}>
            {!cambiar_porcentaje ? `${item.porcentaje}%` : <TextField
                label="Nuevo Porcentaje"
                value={porcentaje_item}
                fullWidth={true}
                onChange={e => setPorcentajeItem(e.target.value)}
                onBlur={e => cambiarPorcentaje(porcentaje_item)}
                autoComplete="off"
            />}
        </span></td>
    </tr>
});

const Configuracion = memo(props => {
    const dispatch = useDispatch();
    const cargarDatos = () => {
        const cargarCostosEnsambles = () => dispatch(actions.fetchBandasEurobeltCostosEnsamblados());
        const cargarProveedores = () => dispatch(actions.fetchProveedoresImportaciones({callback: cargarCostosEnsambles}));
        const cargarCategorias = () => dispatch(actions.fetchCategoriasProductos({callback: cargarProveedores}));
        dispatch(actions.fetchConfiguracionBandaEurobelt({callback: cargarCategorias}));
    };
    const configuracion = useSelector(state => _.map(state.banda_eurobelt_configuracion)[0]);
    const categorias = useSelector(state => state.categorias_productos);
    const proveedores = useSelector(state => state.proveedores_importaciones);
    const costos_ensamblados = useSelector(state => state.banda_eurobelt_costos_ensamblados);
    const onSubmit = (v) => {
        return dispatch(actions.updateConfiguracionBandaEurobelt(configuracion.id, v))
    };
    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearProveedoresImportaciones());
            dispatch(actions.clearCategoriasProductos());
            dispatch(actions.clearBandasEurobeltCostosEnsamblados());
            dispatch(actions.clearConfiguracionBandaEurobelt());
        }
    }, []);
    return (
        <div className="col-12">
            <div className="row">
                <ConfiguracionBandaEurobeltForm
                    proveedores={proveedores}
                    initialValues={configuracion}
                    categorias={categorias}
                    onSubmit={onSubmit}
                />
                <Typography variant="body1" gutterBottom color="primary">
                    Costos Ensamble Banda
                </Typography>
                <table className='table table-responsive table-striped'>
                    <thead>
                    <tr>
                        <th>Aleta</th>
                        <th>Empujador</th>
                        <th>Torneado Varilla</th>
                        <th>Porcentaje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {_.map(_.orderBy(
                        costos_ensamblados,
                        ['con_aleta', 'con_empujador', 'con_torneado'],
                        ['desc', 'desc', 'desc']
                    ), c =>
                        <TablaCostosItem key={c.id} item={c}/>)}
                    </tbody>
                </table>
            </div>
        </div>
    )
});

export default Configuracion;