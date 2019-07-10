import React, {Component, Fragment} from 'react';
import PropTypes from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Tooltip from '@material-ui/core/Tooltip';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {amber} from '@material-ui/core/colors';
import ReactTable from "react-table";
import TIPOS from "./tiposDatos";
import $ from "jquery";
import Button from "@material-ui/core/Button";
import "react-table/react-table.css";

class ErrorsFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columnas: [{}],
            titulo: 'Errores del Archivo',
        };
        this.createColumns = this.createColumns.bind(this);
        this.actionTable = this.actionTable.bind(this);
        this.tableScrollTop = 0;
    }

    createColumns(cabeceras) {
        let columns = [{
            Header: '',
            accessor: 'es_valido',
            Cell: (props) => {
                return props.value ?
                    <FontAwesomeIcon icon={'check'} size='2x'/> :
                    <FontAwesomeIcon icon={'times'} size='2x'/>;
            },
            width: 50,
            style: {
                position: 'relative',
                padding: '0',
                textAlign: 'center',
                backgroundColor: '#fff'
            },
            className: "frozen",
            headerClassName: "frozen"
        }];
        _.map(cabeceras, o => {
            let tipoField = 'text';
            if (o.tipo === TIPOS.int()) {
                tipoField = 'number'
            } else if (o.tipo === TIPOS.string()) {
                tipoField = 'text';
            }

            columns = [...columns,
                {
                    Header: () =>
                        <Fragment>
                            {o.campo}
                            {o.choices &&
                            <Tooltip style={{marginLeft: '10px'}} placement="top" title={
                                <Fragment>
                                    <ul>
                                        {
                                            o.choices.map((item, key) =>
                                                <li key={key}>
                                                    {`${item.id} = ${item.value}`}
                                                </li>)
                                        }
                                    </ul>
                                </Fragment>
                            }>
                                <FontAwesomeIcon icon={'info-circle'} size='1x'/>
                            </Tooltip>
                            }
                        </Fragment>,
                    accessor: o.campo,
                    width: 200,
                    Cell: row =>
                        <input type={tipoField}
                               value={row.value}
                               name={o.campo}
                               id={row.original.index}
                               style={{width: '100%', borderRadius: '10px'}}
                               onChange={this.props.change_values}
                        />
                }];
        });
        columns = [...columns, {
            Header: 'Errores', width: 400, Cell: (({original}) => (
                <Fragment>
                    <ul>
                        {
                            original.errores.map((item, key) =>
                                <li key={key}>
                                    {item}
                                </li>)
                        }
                    </ul>
                </Fragment>
            ))
        }];
        this.setState({
            columnas: columns
        });
    }


    actionTable() {
        return {
            onScroll: e => {
                if (this.tableScrollTop === e.target.scrollTop) {
                    let left = e.target.scrollLeft > 0 ? e.target.scrollLeft : 0;
                    $('.ReactTable .rt-tr .frozen').css({left: left});
                } else {
                    this.tableScrollTop = e.target.scrollTop;
                }
            }
        };
    }

    componentDidMount() {
        const {objectCabecera} = this.props;
        this.createColumns(objectCabecera);
    }

    render() {
        const {
            errors_file,
            total_items,
            handleCloseModal,
            subirListado,
            is_open
        } = this.props;
        const {columnas, titulo} = this.state;
        const data = _.map(errors_file);
        const total_items_error = data.filter(x => !x.es_valido).length;
        const total_items_subir = total_items - total_items_error;
        const style = {
            marginBottom: '20px',
            width: '50%',
            float: 'right',
            backgroundColor: amber[700]
        };
        return (
            <Dialog
                fullScreen={true}
                open={is_open}
                fullWidth={true}
                maxWidth={'xl'}
            >
                <DialogTitle>
                    <strong>{titulo}</strong>
                    <Fragment>
                        <SnackbarContent
                            aria-describedby="client-snackbar"
                            style={style}
                            message={`El archivo tiene un total de ${total_items} items, items a subir ${total_items_subir}, items con error ${total_items_error}`}
                        />
                    </Fragment>
                </DialogTitle>
                <DialogContent>

                    <ReactTable
                        data={data}
                        columns={columnas}
                        defaultPageSize={data.length}
                        sortable={false}
                        className="-striped -highlight"
                        getTableProps={this.actionTable}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button onClick={subirListado}>
                        Subir ({total_items_subir})
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

function areEqual(prevProps, nextProps) {
    const x = _.map(nextProps.errors_file);
    const y = _.map(prevProps.errors_file);
    if (!_.isEqual(x, y)) {
        return false;
    }
    return true;
}

ErrorsFile.propTypes = {
    errors_file: PropTypes.any,
    is_open: PropTypes.bool,
    change_values: PropTypes.any,
    total_items: PropTypes.number,
    handleCloseModal: PropTypes.any,
    subirListado: PropTypes.any,
    objectCabecera: PropTypes.any
};

export default React.memo(ErrorsFile, areEqual);


