import React, {Fragment} from "react";
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import {fechaFormatoUno, pesosColombianos} from '../../../../00_utilities/common';
import Checkbox from 'material-ui/Checkbox';
import ReactTooltip from 'react-tooltip'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import ReactTable from "react-table";

class Tabla extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            item_modal: null
        };
    }

    handleOpen() {
        this.setState({open: true});
    };

    handleClose() {
        this.setState({open: false});
    };

    render() {

        const data = _.orderBy(this.props.data, ['fecha'], ['desc']);
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_hoja,
            permisos_object,
        } = this.props;

        const {
            item_modal
        } = this.state;

        const actions = [
            <FlatButton
                label="Cancelar"
                secondary={true}
                onClick={() => {
                    this.handleClose();
                }}
            />,
            <FlatButton
                label={`${item_modal && item_modal.verificado ? 'Quitar Verificado' : 'Verificar'}`}
                primary={true}
                onClick={() => {
                    this.handleClose();
                    updateItem({...item_modal, verificado: !item_modal.verificado});
                }}
            />,
        ];
        return (
            <Fragment>
                <Dialog
                    title="Verificación hora de trabajo"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
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
                                            <i
                                                className='fas fa-edit puntero'
                                                style={{color: 'green'}}
                                                onClick={() => {
                                                    this.setState({item_modal: row.original});
                                                    this.handleOpen();
                                                }}
                                            >
                                            </i>
                                        </div>
                                },
                                {
                                    Header: "Verificado",
                                    accessor: "verificado",
                                    show: permisos_object.verificar,
                                    maxWidth: 80,
                                    Cell: row =>
                                        <div className='text-center'>
                                            {
                                                row.value ?
                                                    <i
                                                        className='fas fa-check'
                                                        style={{color: 'green'}}
                                                    >
                                                    </i> :
                                                    <i
                                                        className='fas fa-times'
                                                        style={{color: 'red'}}
                                                    >
                                                    </i>
                                            }
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
                                            row.original.literal_abierto ?
                                                <MyDialogButtonDelete
                                                    onDelete={() => {
                                                        onDelete(row.original)
                                                    }}
                                                    element_name={`en ${fechaFormatoUno(row.original.fecha)} para ${row.original.colaborador_nombre}`}
                                                    element_type={singular_name}
                                                /> :
                                                <Fragment></Fragment>
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
        );
    }
}

export default Tabla;