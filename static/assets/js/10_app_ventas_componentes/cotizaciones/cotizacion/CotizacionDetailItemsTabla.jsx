import React, {memo, useContext, useState, useEffect} from "react";
import {useDispatch} from 'react-redux';
import StylesContext from "../../../00_utilities/contexts/StylesContext";
import {pesosColombianos} from "../../../00_utilities/common";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from '@material-ui/core/styles';
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";
import * as actions from "../../../01_actions/01_index";

import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const DragHandle = SortableHandle(() => <FontAwesomeIcon
    icon={'arrows-alt'}
    className={'puntero'}
    size='lg'
/>);

const useStyles = makeStyles(theme => ({
    textField: {
        margin: '2px',
        padding: 0,
        paddingLeft: 5,
        borderRight: '1px solid black',
        borderLeft: '1px solid black',
        borderTop: '1px solid black',
        borderRadius: '5px',
        backgroundColor: theme.palette.primary.light
    },
}));

const CotizacionDetailItemsTablaItem = memo(props => {
    const {item, editable, cargarDatos} = props;
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [cantidad, setCantidad] = useState(item.cantidad);
    const [dias_entrega, setDiasEntrega] = useState(item.dias_entrega);
    const {table} = useContext(StylesContext);
    const classes = useStyles();

    useEffect(() => {
        if (error !== null) {
            setCantidad(item.cantidad);
            setDiasEntrega(item.dias_entrega);
            dispatch(actions.notificarErrorAction('Hubo un error, comunicarse con el adminsitrador del sistema'));
            let error_text = '';
            _.mapKeys(error, (v, k) => {
                error_text = error_text !== '' ? `${error_text}, ${k}: ${v}` : `${k}: ${v}`;
            });
            dispatch(actions.notificarErrorAction(error_text));
            setError(null);
        }
    }, [error]);

    const tipo = () => {
        const es_articulo_catalogo = !!item.articulo_catalogo;
        const es_banda_eurobelt = !!item.banda_eurobelt;
        const es_componenten_eurobelt = !!item.componente_eurobelt;
        if (es_articulo_catalogo) {
            return 'Artículo Catalogo';
        } else if (es_banda_eurobelt) {
            return 'Banda Eurobelt';
        } else if (es_componenten_eurobelt) {
            return 'Comp. Eurobelt';
        } else {
            return 'Otro'
        }
    };

    const eliminarItem = (cotizacion_componente_id, id_item_cotizacion) => dispatch(actions.eliminarItemCotizacionComponente(
        cotizacion_componente_id,
        id_item_cotizacion,
        {
            callback: () => cargarDatos(),
            callback_error: (res) => {
                cargarDatos();
                setError(res.response.data)
            }
        }
    ));
    const cambiarItem = (id_item_cotizacion, item) => dispatch(actions.updateItemCotizacionComponente(
        id_item_cotizacion,
        item,
        {
            callback: () => cargarDatos(),
            callback_error: (res) => {
                cargarDatos();
                setError(res.response.data)
            }
        }
    ));

    return (
        <tr style={{...table.tr}}>
            <td style={table.td}>
                <div style={{marginTop: '7px'}}>
                    {editable && <DragHandle/>} {item.posicion}
                </div>
            </td>
            <td style={{...table.td, fontSize: '0.5rem'}}>{item.canal_nombre} {item.forma_pago_nombre}</td>
            <td style={{...table.td, fontSize: '0.5rem'}}>{tipo()}</td>
            <td style={{...table.td, fontSize: '0.7rem', wordBreak: 'break-all'}}>
                {item.referencia}
            </td>
            <td style={{...table.td, fontSize: '0.7rem'}}>{item.descripcion}</td>
            <td style={{...table.td, fontSize: '0.7rem'}}>{item.unidad_medida}</td>
            <td style={table.td_right}>{pesosColombianos(item.precio_unitario)}</td>
            <td style={{...table.td, width: '70px'}}>
                <TextField
                    disabled={!editable}
                    className={classes.textField}
                    fullWidth={true}
                    value={cantidad}
                    onChange={e => setCantidad(e.target.value)}
                    onBlur={e => {
                        if (parseFloat(item.cantidad) !== parseFloat(e.target.value)) {
                            cambiarItem(item.id, {
                                ...item,
                                cantidad
                            });
                        }
                    }}
                    type='number'
                    margin="normal"
                />
            </td>
            <td style={table.td_right}>{pesosColombianos(item.valor_total)}</td>
            <td style={{...table.td, width: '45px'}}>
                <TextField
                    disabled={!editable}
                    className={classes.textField}
                    fullWidth={true}
                    value={dias_entrega}
                    onChange={e => setDiasEntrega(e.target.value)}
                    onBlur={e => {
                        if (parseFloat(item.dias_entrega) !== parseFloat(e.target.value)) {
                            cambiarItem(item.id, {...item, dias_entrega})
                        }
                    }}
                    type='number'
                    margin="normal"
                />
            </td>
            <td style={table.td}>{item.transporte_tipo}</td>
            {editable &&
            <td style={table.td}>
                <MyDialogButtonDelete
                    onDelete={() => eliminarItem(item.cotizacion, item.id)}
                    element_name={item.referencia}
                    element_type='Item Cotización'
                />
            </td>
            }
        </tr>
    )
});

const SortableItem = SortableElement(({item, cargarDatos, editable}) =>
    <CotizacionDetailItemsTablaItem
        item={item}
        editable={editable}
        cargarDatos={cargarDatos}
    />
);


const SortableList = SortableContainer(({items, editable, cargarDatos}) => {
    return (
        <tbody>
        {_.orderBy(items, ['posicion'], ['asc']).map((item) => (
            <SortableItem
                disabled={!editable}
                useDragHandle
                key={item.id}
                index={item.posicion}
                cargarDatos={cargarDatos}
                editable={editable}
                item={item}
            />
        ))}
        </tbody>
    );
});

function areEqual(prevProps, nextProps) {
    return _.isEqual(prevProps.items, nextProps.items) && prevProps.editable === nextProps.editable
}

const CotizacionDetailItemsTabla = memo(props => {
    const {table} = useContext(StylesContext);
    const dispatch = useDispatch();
    const {
        cotizacion_componente,
        cotizacion_componente: {items},
        cargarDatos,
        valor_total,
        cantidad_items,
        editable
    } = props;

    const onSortEnd = ({oldIndex, newIndex}) => {
        const item_uno = items.filter(e => e.posicion === oldIndex)[0];
        const item_dos = items.filter(e => e.posicion === newIndex)[0];
        if (oldIndex !== newIndex) {
            dispatch(actions.cambiarPosicionItemCotizacionComponente(
                cotizacion_componente.id,
                item_uno.id,
                item_dos.id,
                {
                    callback: () => cargarDatos()
                }
            ))
        }
    };

    return (
        <table className='table table-striped table-responsive' style={table}>
            <thead>
            <tr style={table.tr}>
                <th style={table.td}>Orden</th>
                <th style={table.td}>F. Pago</th>
                <th style={table.td}>Tipo</th>
                <th style={table.td}>Referencia</th>
                <th style={table.td}>Descripción</th>
                <th style={table.td}>Uni. Med</th>
                <th style={table.td}>$ Unitario</th>
                <th style={table.td}>Cant.</th>
                <th style={table.td}>$ Total</th>
                <th style={table.td}>T. Ent</th>
                <th style={table.td}>Tipo Transporte</th>
                {editable &&
                <th style={table.td}>Eli.</th>
                }
            </tr>
            </thead>
            <SortableList
                useDragHandle
                onSortEnd={onSortEnd}
                cargarDatos={cargarDatos}
                editable={editable}
                items={items}
            />
            <tfoot>
            <tr style={table.tr}>
                <td style={table.td}>Total</td>
                <td style={table.td}></td>
                <td style={table.td}></td>
                <td style={table.td}></td>
                <td style={table.td}></td>
                <td style={table.td}></td>
                <td style={table.td}></td>
                <td style={table.td} className='text-center'>{cantidad_items}</td>
                <td style={table.td_right}>{pesosColombianos(valor_total)}</td>
                <td style={table.td}></td>
                <td style={table.td}></td>
                {editable &&
                <td style={table.td}></td>
                }
            </tr>
            </tfoot>
        </table>
    )

});

export default CotizacionDetailItemsTabla;