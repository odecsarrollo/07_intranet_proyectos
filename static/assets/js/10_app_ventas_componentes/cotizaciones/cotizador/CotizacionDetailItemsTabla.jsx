import React, {memo, useContext, useState} from "react";
import StylesContext from "../../../00_utilities/contexts/StylesContext";
import {pesosColombianos} from "../../../00_utilities/common";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from '@material-ui/core/styles';
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
    const {item, eliminarItem, cambiarItem, cambiarPosicionItem, max_posicion, editable} = props;
    const [cantidad, setCantidad] = useState(item.cantidad);
    const [dias_entrega, setDiasEntrega] = useState(item.dias_entrega);
    const {table} = useContext(StylesContext);
    const classes = useStyles();
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
    return (
        <tr style={{...table.tr}}>
            <td style={table.td}>
                <div className="row">
                    {editable &&
                    <div className="col-2 text-center">
                        {item.posicion !== 1 &&
                        <FontAwesomeIcon
                            onClick={() => cambiarPosicionItem(item.id, 'SUBE')}
                            className='puntero p-0 m-0'
                            icon='arrow-circle-up'
                            size='sm'
                        />}
                        {item.posicion !== max_posicion &&
                        <FontAwesomeIcon
                            onClick={() => cambiarPosicionItem(item.id, 'BAJA')}
                            className='puntero p-0 m-0'
                            icon='arrow-circle-down'
                            size='sm'
                        />
                        }
                    </div>}
                    <div className="col-3">
                        {item.posicion}
                    </div>
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
                            cambiarItem(item.id, {...item, cantidad});
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
            {editable &&
            <td style={table.td}>
                <MyDialogButtonDelete
                    onDelete={() => eliminarItem(item.id)}
                    element_name={item.referencia}
                    element_type='Item Cotización'
                />
            </td>
            }
        </tr>
    )
});

function areEqual(prevProps, nextProps) {
    return _.isEqual(prevProps.items, nextProps.items) && prevProps.editable === nextProps.editable
}

const CotizacionDetailItemsTabla = memo(props => {
    const {table} = useContext(StylesContext);
    const {
        items,
        eliminarItem,
        cambiarItem,
        cambiarPosicionItem,
        valor_total,
        cantidad_items,
        editable
    } = props;
    const max_posicion = items.length;
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
                {editable &&
                <th style={table.td}>Eli.</th>
                }
            </tr>
            </thead>
            <tbody>
            {_.orderBy(items, ['posicion'], ['asc']).map(item => <CotizacionDetailItemsTablaItem
                editable={editable}
                max_posicion={max_posicion}
                key={item.id}
                item={item}
                eliminarItem={eliminarItem}
                cambiarItem={cambiarItem}
                cambiarPosicionItem={cambiarPosicionItem}
            />)}
            </tbody>
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
                {editable &&
                <td style={table.td}></td>
                }
            </tr>
            </tfoot>
        </table>
    )

}, areEqual);

export default CotizacionDetailItemsTabla;