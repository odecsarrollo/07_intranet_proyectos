import React, {Fragment, memo, useState} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import {fechaFormatoUno, pesosColombianos} from '../../../00_utilities/common';
import ReactTooltip from 'react-tooltip'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import ReactTable from "react-table";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}

const Tabla = memo(props => {
    const data = _.orderBy(props.list, ['fecha'], ['desc']);
    const {
        updateItem,
        singular_name,
        onDelete,
        permisos_hoja,
        permisos_object,
        configuracion_costos
    } = props;
    const [item_modal, setItemModal] = useState(null);
    const [open, setOpen] = useState(false);
    const fecha_cierre = configuracion_costos ? configuracion_costos.fecha_cierre : null;
    return (
        <Fragment>
            <Dialog
                open={open}
            >
                <DialogTitle id="customized-dialog-title" onClose={()=>setOpen(false)}>
                    Verificación hora de trabajo
                </DialogTitle>
                <DialogContent>
                    {item_modal &&
                    <div>
                        <strong>Colaborador: </strong>{item_modal.colaborador_nombre}<br/>
                        <strong>Fecha: </strong>{fechaFormatoUno(item_modal.fecha)}<br/>
                        <strong>Literal: </strong>{item_modal.literal_nombre}<br/>
                        <strong>Descripción Literal: </strong>{item_modal.literal_descripcion}<br/>
                        <strong>Motivo: </strong>{item_modal.descripcion_tarea}<br/>
                        <strong>Tiempo: </strong>{item_modal.horas} horas y {item_modal.minutos} minutos<br/>
                    </div>
                    }
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            setOpen(false);
                            updateItem({...item_modal, verificado: !item_modal.verificado});
                        }}
                    >
                        {`${item_modal && item_modal.verificado ? 'Quitar Verificado' : 'Verificar'}`}
                    </Button>
                </DialogActions>
            </Dialog>
            <ReactTooltip/>
            <ReactTable
                data={data}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Fecha",
                                accessor: "fecha",
                                maxWidth: 130,
                                Cell: row => fechaFormatoUno(row.value)
                            },
                            {
                                Header: "Literal",
                                accessor: "literal_nombre",
                                maxWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Literal",
                                accessor: "literal_descripcion",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Colaborador",
                                accessor: "colaborador_nombre",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Creado Por",
                                accessor: "creado_por_username",
                                maxWidth: 100
                            },
                            {
                                Header: "Horas",
                                accessor: "horas",
                                maxWidth: 50,
                                Cell: row =>
                                    <div className='text-right'>
                                        {row.value}
                                    </div>
                            },
                            {
                                Header: "Minutos",
                                accessor: "minutos",
                                maxWidth: 60,
                                Cell: row =>
                                    <div className='text-right'>
                                        {row.value}
                                    </div>
                            },
                            {
                                Header: "Valor Hora",
                                accessor: "tasa_valor_hora",
                                maxWidth: 80,
                                show: permisos_hoja.costos,
                                Cell: row =>
                                    <div className='text-right'>
                                        {pesosColombianos(row.value)}
                                    </div>
                            },
                            {
                                Header: "Costo Total",
                                accessor: "costo_total",
                                maxWidth: 100,
                                show: permisos_hoja.costos,
                                Cell: row =>
                                    <div className='text-right'>
                                        {pesosColombianos(row.value)}
                                    </div>
                            },
                            {
                                Header: "Verificar",
                                maxWidth: 70,
                                Cell: row =>
                                    <div className='text-center'>
                                        {
                                            row.original.fecha > fecha_cierre &&
                                            <IconButton
                                                className='puntero'
                                                style={{
                                                    margin: 0,
                                                    padding: 4,
                                                }}
                                                onClick={() => {
                                                    setItemModal(row.original);
                                                    setOpen(true);
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    style={{color: 'green'}}
                                                    icon={'edit'}
                                                    size='xs'
                                                />
                                            </IconButton>
                                        }
                                    </div>
                            },
                            {
                                Header: "Verificado",
                                accessor: "verificado",
                                show: permisos_object.verificar,
                                maxWidth: 80,
                                Cell: row =>
                                    <div className='text-center'>
                                        <FontAwesomeIcon
                                            icon={row.value ? 'check' : 'times'}
                                            style={{color: row.value ? 'green' : 'red'}}
                                        />
                                    </div>
                            },
                        ]
                    },
                    {
                        Header: "Opciones",
                        columns: [
                            {
                                Header: "Elimi.",
                                show: permisos_object.delete,
                                maxWidth: 60,
                                Cell: row => {
                                    return (
                                        row.original.literal_abierto && row.original.fecha > fecha_cierre ?
                                            <MyDialogButtonDelete
                                                onDelete={() => {
                                                    onDelete(row.original)
                                                }}
                                                element_name={`en ${fechaFormatoUno(row.original.fecha)} para ${row.original.colaborador_nombre}`}
                                                element_type={singular_name}
                                            /> :
                                            <Fragment>

                                            </Fragment>
                                    )
                                }

                            },
                        ]
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        </Fragment>
    )
}, areEqual);
export default Tabla;