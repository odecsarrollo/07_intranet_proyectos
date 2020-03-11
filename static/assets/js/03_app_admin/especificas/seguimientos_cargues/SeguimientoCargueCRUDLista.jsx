import React, {Fragment, memo, useState} from "react";
import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";
import {makeStyles} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ListItemText from "@material-ui/core/ListItemText";
import {horaFormatoUno, fechaHoraFormatoUno} from "../../../00_utilities/common";
import ReactTable from "react-table";

const useStyles = makeStyles(theme => ({
    main: {
        paddingLeft: theme.spacing(2),
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    iconColor: {
        color: theme.palette.primary.dark
    }
}));

const ListCollapse = memo(props => {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const {texto, children} = props;
    return (
        <Fragment>
            <ListItem
                button
                onClick={() => {
                    setOpen(!open);
                }}
            >
                <ListItemText primary={texto}/>
                {open ?
                    <FontAwesomeIcon icon={'angle-up'} className={classes.iconColor}/> :
                    <FontAwesomeIcon icon={'angle-down'} className={classes.iconColor}/>}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {children}
                </List>
            </Collapse>
        </Fragment>
    )
});

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}

const Tabla = memo(props => {
    const data = _.orderBy(props.list, ['fecha'], ['desc']);
    return (
        <div>
            {_.map(data, e => {
                const fecha_inicial = `Fecha Inicial: ${fechaHoraFormatoUno(e.fecha)}`;
                const fecha_final = e.fecha_final ? `Fecha Final: ${fechaHoraFormatoUno(e.fecha_final)}${e.fecha_final ? ` (${e.tiempo.toFixed(2)} minutos)` : ''}` : 'Error';
                return (
                    <ListCollapse key={e.id}
                                  texto={`${e.descripcion} - ${fecha_inicial}, ${fecha_final}`}
                    >
                        <ReactTable
                            data={e.procedimientos}
                            columns={[
                                {
                                    Header: "Procedimientos",
                                    columns: [
                                        {
                                            Header: "Hora Inicial",
                                            accessor: "fecha",
                                            maxWidth: 80,
                                            minWidth: 80,
                                            Cell: row => <div>{horaFormatoUno(row.value)}</div>
                                        },
                                        {
                                            Header: "Hora Final",
                                            accessor: "fecha_final",
                                            maxWidth: 80,
                                            minWidth: 80,
                                            Cell: row => <div>{horaFormatoUno(row.value)}</div>
                                        },
                                        {
                                            Header: "Procedimiento",
                                            accessor: "procedimiento_nombre",
                                        },
                                        {
                                            Header: "Tabla",
                                            accessor: "tabla"
                                        },
                                        {
                                            Header: "Tarea",
                                            accessor: "tarea",
                                            maxWidth: 220,
                                            minWidth: 220,
                                        },
                                        {
                                            Header: "Nro. Filas",
                                            accessor: "numero_filas",
                                            maxWidth: 70,
                                            minWidth: 70,
                                        },
                                        {
                                            Header: "Tiempo",
                                            accessor: "tiempo",
                                            maxWidth: 100,
                                            minWidth: 100,
                                            Cell: row =>
                                                <div>{row.original.fecha_final ? ` (${row.value.toFixed(2)} minutos)` : ''}</div>
                                        },
                                    ]
                                },
                            ]}
                            defaultPageSize={e.procedimientos.length}
                            className="-striped -highlight tabla-maestra"
                        />
                    </ListCollapse>
                )
            })}
        </div>
    )
}, areEqual);

export default Tabla;