import React, {Component, Fragment} from 'react';
import ReactFileReader from 'react-file-reader';

const style = {
    table: {
        fontSize: '0.6rem',
        tr: {
            td: {paddingTop: '1px', paddingBottom: '1px'},
            th: {paddingTop: '1px', paddingBottom: '1px'},
        }
    }
};

class RowTabla extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            editando_codigo_cguno: false,
            editando_cantidad: false,
        })
    }

    render() {
        const {
            fila,
            onChangeItem,
            onDeleteFila,
            listado_mezcla,
            onTraerCodigosProductos
        } = this.props;
        const {
            editando_codigo_cguno,
            editando_cantidad
        } = this.state;

        const listado_prueba = _.map(_.pickBy(listado_mezcla, e => e.ITEM !== fila.ITEM), e => e.CGUNO);
        const esta_repetido = listado_prueba.includes(`${fila.CGUNO.trim()}`);
        return (
            <tr>
                <td style={style.table.tr.td}>
                    <i
                        className={`${fila.en_cguno ? 'far fa-check-circle' : 'far fa-exclamation-circle'} fa-2x`}
                        style={{color: fila.en_cguno ? 'green' : 'orange'}}
                    >
                    </i>
                </td>
                <td style={style.table.tr.td}>
                    <i
                        className={`${!esta_repetido ? 'far fa-check-circle' : 'far fa-times-circle'} fa-2x`}
                        style={{color: !esta_repetido ? 'green' : 'red'}}
                    >
                    </i>
                </td>
                <td style={style.table.tr.td}>
                    {
                        fila.item_cguno &&
                        fila.item_cguno.descripcion
                    }
                </td>
                <td style={style.table.tr.td}>{fila.ITEM}</td>
                <td style={style.table.tr.td}>{fila.CODIGO}</td>
                <td style={style.table.tr.td}>
                    {
                        editando_codigo_cguno ?
                            <input
                                value={fila.CGUNO}
                                onChange={(event) => onChangeItem({...fila, CGUNO: event.target.value})}
                                onBlur={() => {
                                    this.setState({editando_codigo_cguno: false});
                                    onTraerCodigosProductos();
                                }}
                            /> :
                            <div>
                                <span
                                    className='puntero'
                                    onClick={
                                        () => {
                                            this.setState({editando_codigo_cguno: true})
                                        }}
                                >
                                    {fila.CGUNO}
                                    </span>
                                {
                                    !fila.en_cguno &&
                                    <i style={{color: 'orange'}}
                                       onClick={
                                           () => {
                                               this.setState({editando_codigo_cguno: true})
                                           }}
                                       className='far fa-exclamation-circle puntero fa-2x'>
                                    </i>
                                }
                            </div>
                    }
                </td>
                <td style={style.table.tr.td}>{fila.DESCRIPCION}</td>
                <td style={style.table.tr.td}>{fila.MATERIAL}</td>
                <td style={style.table.tr.td}>{fila.CANT_MAT}</td>
                <td style={style.table.tr.td}>
                    {
                        editando_cantidad ?
                            <input
                                value={fila.CANT}
                                onChange={(event) => onChangeItem({...fila, CANT: event.target.value})}
                                onBlur={() => {
                                    this.setState({editando_cantidad: false});
                                }}
                            /> :
                            <div>
                                <span
                                    className='puntero'
                                    onClick={
                                        () => {
                                            this.setState({editando_cantidad: true})
                                        }}
                                >
                                    {fila.CANT}
                                    </span>
                            </div>
                    }
                </td>
                <td style={style.table.tr.td}>{fila.PROCESO}</td>
                <td style={style.table.tr.td}>{fila.ACABADO}</td>
                <td style={style.table.tr.td}>
                    <i
                        onClick={() => onDeleteFila(fila)}
                        className='fas fa-trash puntero fa-lg'>
                    </i>
                </td>
            </tr>
        )
    }
}

class CargueMateriales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listado_cargue: null,
            cabecera: ['ITEM', 'CODIGO', 'CGUNO', 'DESCRIPCION', 'MATERIAL', 'CANT_MAT', 'CANT', 'PROCESO', 'ACABADO'],
            error_columnas: null,
            archivo: null
        };
        this.inputFileChanged = this.inputFileChanged.bind(this);
        this.onTraerCodigosProductos = this.onTraerCodigosProductos.bind(this);
        this.onChangeItem = this.onChangeItem.bind(this);
        this.onDeleteFila = this.onDeleteFila.bind(this);
        this.onCargarListado = this.onCargarListado.bind(this);
    }

    onTraerCodigosProductos(callback = null) {
        const {listado_cargue} = this.state;
        const codigos = _.map(listado_cargue, e => parseInt(e.CGUNO));
        const codigos_numeros = codigos.filter(e => Number.isInteger(e));
        this.props.fetchItemsBiablexCodigos(JSON.stringify(codigos_numeros), {callback});
    }

    onDeleteFila(fila) {
        this.setState(s => {
            return (
                {listado_cargue: _.omit(s.listado_cargue, fila.ITEM)}
            )
        });
    }

    onCargarListado() {
        const {
            cargarItemsListadoMateriales,
            literal,
            notificarErrorAjaxAction,
            cargando,
            noCargando,
            items_cguno
        } = this.props;
        cargando();
        const hacerCargue = () => {
            const cargue = _.map(this.state.listado_cargue, e => {
                const existe = _.has(items_cguno, e.CGUNO);
                return (
                    {
                        literal_id: literal.id,
                        codigo: e.CODIGO,
                        item_cguno_id: existe ? e.CGUNO : null,
                        descripcion: e.DESCRIPCION,
                        material: e.MATERIAL,
                        cantidad_material: e.CANT_MAT,
                        cantidad: e.CANT,
                        proceso: e.PROCESO,
                        acabado: e.ACABADO,
                    }
                )
            });
            cargarItemsListadoMateriales(literal.id, cargue, () => noCargando(), notificarErrorAjaxAction);
        };
        this.onTraerCodigosProductos(hacerCargue);
    }

    inputFileChanged(files) {
        const reader = new FileReader();
        const scope = this;
        this.setState({archivo: files[0]});
        reader.onload = () => {
            const {cabecera} = scope.state;
            const separado_lineas = reader.result.split('\n');
            const cabecera_archivo = _.split(separado_lineas[0], ';').map(e => _.trim(e));
            const columnas_iguales = _.isEqual(cabecera_archivo, cabecera);

            scope.setState({error_columnas: columnas_iguales ? null : true});

            if (columnas_iguales) {
                let resultado = _.map(separado_lineas, e => {
                    const lineas = _.split(e, ';');
                    let objeto = {};
                    cabecera.map(c => {
                        const index = _.indexOf(cabecera, c);
                        objeto = {...objeto, [c]: _.trim(lineas[index])}
                    });
                    return objeto
                });
                resultado = _.mapKeys(resultado, 'ITEM');
                resultado = _.omit(resultado, ['ITEM']);
                scope.setState({listado_cargue: resultado});
                scope.onTraerCodigosProductos()
            }
        };
        reader.readAsText(files[0]);
    }

    onChangeItem(fila) {
        this.setState((s) => {
            const listado_cargue_modificado = {...s.listado_cargue, [fila.ITEM]: fila};
            return {listado_cargue: listado_cargue_modificado}
        });
    }

    render() {
        const {
            listado_cargue,
            cabecera,
            error_columnas,
            archivo
        } = this.state;
        const {
            items_cguno,
        } = this.props;
        const listado_mezcla = _.map(listado_cargue, e => {
            return {
                ...e,
                en_cguno: _.has(items_cguno, e.CGUNO),
                item_cguno: items_cguno[e.CGUNO]
            }
        });
        return (
            <div>
                <ReactFileReader
                    handleFiles={files => {
                        this.inputFileChanged(files);
                    }} fileTypes='.csv'>
                    <Fragment>
                        <button className='btn btn-primary puntero' ref="input_reader">Archivo</button>
                        {
                            archivo &&
                            <div style={{fontSize: '0.8rem'}}>
                                <strong>Nombre Archivo: </strong>{archivo.name}<br/>
                                <strong>Tamaño: </strong>{archivo.size / 1000} kb
                            </div>
                        }
                    </Fragment>
                </ReactFileReader>
                {
                    error_columnas &&
                    <Fragment>
                        <span>Se ha presentado problemas con el archivo, las columnas no coinciden con el formato:</span><br/>
                        {cabecera.map(e => <span key={e}>| {e} </span>)}
                    </Fragment>
                }
                {
                    listado_cargue &&
                    !error_columnas &&
                    <Fragment>
                        <table style={style.table} className='table table-responsive table-striped'>
                            <thead>
                            <tr>
                                <th style={style.table.tr.th}>Existe CGUNO</th>
                                <th style={style.table.tr.th}>No Repíte</th>
                                <th>Descripción CGUNO</th>
                                {cabecera.map(c => {
                                    return <th style={style.table.tr.th} key={c}>
                                        {c}
                                    </th>
                                })}
                                <th>
                                    Eliminar
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                _.map(listado_mezcla, e => {
                                    return <RowTabla
                                        key={e.ITEM}
                                        fila={e}
                                        onChangeItem={this.onChangeItem}
                                        onTraerCodigosProductos={this.onTraerCodigosProductos}
                                        onDeleteFila={this.onDeleteFila}
                                        listado_mezcla={listado_mezcla}
                                    />
                                })
                            }
                            </tbody>
                        </table>
                        <input className='btn btn-primary' type='button' onClick={() => this.onCargarListado()}
                               value='Cargar'/>
                    </Fragment>
                }
            </div>
        )
    }
}

export default CargueMateriales;