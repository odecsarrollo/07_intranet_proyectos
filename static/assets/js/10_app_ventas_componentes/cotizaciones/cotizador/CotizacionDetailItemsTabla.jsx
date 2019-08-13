import React, {memo, useContext, useState} from "react";
import StylesContext from "../../../00_utilities/contexts/StylesContext";
import {pesosColombianos} from "../../../00_utilities/common";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from '@material-ui/core/styles';
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";

const useStyles = makeStyles(theme => ({
    textField: {
        margin: '2px',
        padding: 0,
        textAlign: 'right',
        borderRight: '1px solid black',
        borderLeft: '1px solid black',
        borderTop: '1px solid black',
        borderRadius: '5px'
    },
}));

const CotizacionDetailItemsTablaItem = memo(props => {
    const {item, eliminarItem, cambiarItem} = props;
    const [cantidad, setCantidad] = useState(item.cantidad);
    const [dias_entrega, setDiasEntrega] = useState(item.dias_entrega);
    const {table} = useContext(StylesContext);
    const classes = useStyles();
    return (
        <tr style={table.tr}>
            <td style={table.td}>{item.referencia}</td>
            <td style={table.td}>{item.descripcion}</td>
            <td style={table.td}>{item.unidad_medida}</td>
            <td style={table.td_right}>{pesosColombianos(item.precio_unitario)}</td>
            <td style={{...table.td, width: '70px'}}>
                <TextField
                    className={classes.textField}
                    fullWidth={true}
                    value={cantidad}
                    onChange={e => setCantidad(e.target.value)}
                    onBlur={() => cambiarItem({...item, cantidad})}
                    type='number'
                    margin="normal"
                />
            </td>
            <td style={table.td_right}>{pesosColombianos(item.valor_total)}</td>
            <td style={{...table.td, width: '50px'}}>
                <TextField
                    className={classes.textField}
                    fullWidth={true}
                    value={dias_entrega}
                    onChange={e => setDiasEntrega(e.target.value)}
                    onBlur={() => {
                        cambiarItem({...item, dias_entrega})
                    }}
                    type='number'
                    margin="normal"
                />
            </td>
            <td style={table.td}>
                <MyDialogButtonDelete
                    onDelete={() => eliminarItem(item.id)}
                    element_name={item.referencia}
                    element_type='Item Cotización'
                />
            </td>
        </tr>
    )
});

const CotizacionDetailItemsTabla = memo(props => {
    const {table} = useContext(StylesContext);
    const {items, eliminarItem, cambiarItem} = props;
    return (
        <table className='table table-striped table-responsive' style={table}>
            <thead>
            <tr style={table.tr}>
                <th style={table.td}>Referencia</th>
                <th style={table.td}>Descripción</th>
                <th style={table.td}>Uni. Med</th>
                <th style={table.td}>$ Unitario</th>
                <th style={table.td}>Cant.</th>
                <th style={table.td}>$ Total</th>
                <th style={table.td}>T. Ent</th>
                <th style={table.td}>Eliminar</th>
            </tr>
            </thead>
            <tbody>
            {items.map(item => <CotizacionDetailItemsTablaItem
                key={item.id}
                item={item}
                eliminarItem={eliminarItem}
                cambiarItem={cambiarItem}
            />)}
            </tbody>
        </table>
    )

});

export default CotizacionDetailItemsTabla;