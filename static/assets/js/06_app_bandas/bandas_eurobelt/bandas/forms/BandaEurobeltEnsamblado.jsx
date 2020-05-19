import React, {memo, useState, Fragment, useContext} from 'react';
import Typography from "@material-ui/core/Typography";
import Combobox from "react-widgets/lib/Combobox";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import StylesContext from '../../../../00_utilities/contexts/StylesContext';
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import {formatoDinero, formatoMoneda, pesosColombianos} from "../../../../00_utilities/common";
import * as actions from "../../../../01_actions/01_index";
import MyDialogButtonDelete from "../../../../00_utilities/components/ui/dialog/delete_dialog";

const AddEnsambladoForm = memo(props => {
    const {onCancel, agregarComponente, componentes} = props;
    const [componente_id, setComponenteId] = useState(null);
    const [cortado_a, setCortadoA] = useState('COMPLETO');
    const [cantidad, setCantidad] = useState(0);
    return (
        <div className='row'>
            <div className="col-12">
                <Combobox
                    data={_.map(_.pickBy(componentes, e => e.activo), c => ({
                        nombre: `${c.referencia} - ${c.nombre}`,
                        id: c.id
                    }))}
                    onChange={(e) => setComponenteId(e.id)}
                    value={componente_id}
                    placeholder='Seleccionar Componente'
                    valueField='id'
                    textField='nombre'
                    filter='contains'
                />
            </div>
            {componente_id && <Fragment>
                <div className="col-md-4">
                    <TextField
                        fullWidth={true}
                        label='Cantidad'
                        margin="normal"
                        name='cantidad'
                        type='number'
                        value={cantidad}
                        onChange={v => setCantidad(v.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <TextField
                        fullWidth={true}
                        label='Cortado A...'
                        margin="normal"
                        name='cortado_a'
                        value={cortado_a}
                        onChange={v => setCortadoA(v.target.value)}
                    />
                </div>
            </Fragment>}
            <div className="col-12">
                {componente_id && cortado_a && cantidad > 0 && <Button
                    color="primary"
                    variant="contained"
                    className='ml-3'
                    onClick={() => agregarComponente(componente_id, cantidad, cortado_a)}
                >
                    Adicionar
                </Button>}
                <Button
                    color="secondary"
                    variant="contained"
                    className='ml-3'
                    onClick={onCancel}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    )
});

const GrupoEnsamblado = memo(props => {
    const [open_add_ensamblado, setOpenAddlEnsamblado] = useState(false);
    const dispatch = useDispatch();
    const {
        nombre_grupo,
        onClick,
        banda,
        id_categoria,
        ensamblado_banda,
        componentes_para_agregar,
        setCategoriaAAgregar,
    } = props;
    const ensamblado_lista = _.pickBy(ensamblado_banda, e => e.componente && e.componente.categoria === id_categoria);
    const costo_total = _.map(ensamblado_lista).reduce((uno, dos) => uno + (parseFloat(dos.componente.costo) * parseFloat(dos.cantidad)), 0);
    const costo_total_cop = _.map(ensamblado_lista).reduce((uno, dos) => uno + (parseFloat(dos.componente.costo_cop) * parseFloat(dos.cantidad)), 0);
    const costo_total_usd = _.map(ensamblado_lista).reduce((uno, dos) => uno + (parseFloat(dos.componente.costo_usd) * parseFloat(dos.cantidad)), 0);
    const cantidad = _.map(ensamblado_lista).reduce((uno, dos) => uno + (parseFloat(dos.cantidad)), 0);
    const {table} = useContext(StylesContext);

    const agregarComponente = (componente_id, cantidad, cortado_a, callback) => {
        dispatch(actions.adicionarComponenteBandaEurobelt(banda.id, componente_id, cantidad, cortado_a, {callback}));
    };
    const quitarComponente = componente_id => dispatch(actions.quitarComponenteBandaEurobelt(banda.id, componente_id));
    return (
        <div className="col-12">
            <Typography
                variant="h6"
                color="primary"
                noWrap
                onClick={() => {
                    if (_.size(componentes_para_agregar) === 0) {
                        onClick();
                        setOpenAddlEnsamblado(true);
                    }
                }}
            >
                <span className='puntero'>{nombre_grupo}</span>
            </Typography>
            {open_add_ensamblado &&
            <AddEnsambladoForm
                componentes={componentes_para_agregar}
                onCancel={() => {
                    setCategoriaAAgregar(null);
                    setOpenAddlEnsamblado(false);
                }}
                agregarComponente={(componente_id, cantidad, cortado_a) => {
                    agregarComponente(componente_id, cantidad, cortado_a);
                    setCategoriaAAgregar(null);
                    setOpenAddlEnsamblado(false);
                }}
            />}
            {_.size(ensamblado_lista) > 0 &&
            <table className='table table-striped table-responsive' style={table}>
                <thead>
                <tr style={table.tr}>
                    <th style={table.td}>Referencia</th>
                    <th style={table.td}>Componente</th>
                    <th style={table.td}>Cortado A</th>
                    <th style={table.td}>Cantidad</th>
                    <th style={table.td}>Costo EUR</th>
                    <th style={table.td}>Costo EUR Total</th>
                    <th style={table.td}>Costo USD</th>
                    <th style={table.td}>Costo USD Total</th>
                    <th style={table.td}>Costo COP</th>
                    <th style={table.td}>Costo COP Total</th>
                    <th style={table.td}>Delete</th>
                </tr>
                </thead>
                <tbody>
                {_.map(ensamblado_lista, e => <tr key={e.id} style={table.tr}>
                    <td style={table.td}>{e.componente.referencia}</td>
                    <td style={table.td}>{e.componente.nombre}</td>
                    <td style={table.td}>{e.cortado_a}</td>
                    <td style={table.td} className='text-center'>{e.cantidad}</td>
                    <td style={table.td}
                        className='text-right'>{formatoMoneda(parseFloat(e.componente.costo), '‎€', 4, 'EUR')}</td>
                    <td style={table.td}
                        className='text-right'>{formatoMoneda(parseFloat(e.componente.costo) * parseFloat(e.cantidad), '‎€', 4, 'EUR')}</td>
                    <td style={table.td}
                        className='text-right'>{formatoMoneda(parseFloat(e.componente.costo_usd), '‎$', 2, 'USD')}</td>
                    <td style={table.td}
                        className='text-right'>{formatoMoneda(parseFloat(e.componente.costo_usd) * parseFloat(e.cantidad), '$', 4, 'USD')}</td>
                    <td style={table.td}
                        className='text-right'>{formatoMoneda(parseFloat(e.componente.costo_cop), '‎$', 0, 'COP')}</td>
                    <td style={table.td}
                        className='text-right'>{formatoMoneda(parseFloat(e.componente.costo_cop) * parseFloat(e.cantidad), '$', 0, 'COP')}</td>
                    <td style={table.td} className='text-center'>
                        <MyDialogButtonDelete
                            onDelete={() => {
                                quitarComponente(e.id)
                            }}
                            element_name={e.componente.nombre}
                            element_type='Componente Ensamblado'
                        />
                    </td>
                </tr>)}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={3} style={table.td}>
                        Total
                    </td>
                    <td style={table.td} className='text-center'>{cantidad}</td>
                    <td style={table.td}></td>
                    <td style={table.td} className='text-right'>{formatoMoneda(costo_total, '‎‎€', 4, 'EUR')}</td>
                    <td style={table.td}></td>
                    <td style={table.td} className='text-right'>{formatoMoneda(costo_total_usd, '‎$', 4, 'USD')}</td>
                    <td style={table.td}></td>
                    <td style={table.td} className='text-right'>{formatoMoneda(costo_total_cop, '‎$', 0, 'COP')}</td>
                </tr>
                </tfoot>
            </table>
            }
        </div>
    )
});


const BandaEurobeltEnsamblado = memo(props => {
    const {
        configuracion,
        componentes,
        banda,
        agregarComponente
    } = props;
    const {con_aleta, con_empujador, ensamblado, empujador_tipo} = banda;
    const [categoria_a_agregar, setCategoriaAAgregar] = useState(null);
    const id_categoria_empujador = configuracion ? configuracion.categoria_empujador : null;
    const id_categoria_aleta = configuracion ? configuracion.categoria_aleta : null;
    const id_categoria_modulo = configuracion ? configuracion.categoria_modulo : null;
    const id_categoria_tapa = configuracion ? configuracion.categoria_tapa : null;
    const id_categoria_varilla = configuracion ? configuracion.categoria_varilla : null;
    const componentes_para_serie = _.pickBy(componentes, c => c.series_compatibles.includes(banda.serie));
    let componentes_para_agregar = _.pickBy(componentes_para_serie, c => c.categoria === categoria_a_agregar);
    if (categoria_a_agregar === id_categoria_empujador) {
        componentes_para_agregar = _.pickBy(componentes_para_agregar, c => c.tipo_banda === empujador_tipo);
    }
    const ensamblado_banda = _.map(ensamblado, e => ({...e, componente: componentes[e.componente]}));
    return (
        <div className='col-12'>
            <Typography variant="h4" color="primary" noWrap>
                Ensamblado
                ({formatoMoneda(banda.costo_banda, '‎€', 4, 'EUR')}, {formatoMoneda(banda.costo_cop, '$', 0, 'COP')})
            </Typography>
            <div className="row pl-4">
                {con_empujador &&
                <GrupoEnsamblado
                    banda={banda}
                    ensamblado_banda={ensamblado_banda}
                    componentes_para_agregar={componentes_para_agregar}
                    id_categoria={id_categoria_empujador}
                    categoria_a_agregar={categoria_a_agregar}
                    nombre_grupo={'Empujadores'}
                    setCategoriaAAgregar={setCategoriaAAgregar}
                    agregarComponente={agregarComponente}
                    onClick={() => {
                        setCategoriaAAgregar(id_categoria_empujador);
                    }}
                />}
                {con_aleta &&
                <GrupoEnsamblado
                    banda={banda}
                    ensamblado_banda={ensamblado_banda}
                    componentes_para_agregar={componentes_para_agregar}
                    id_categoria={id_categoria_aleta}
                    categoria_a_agregar={categoria_a_agregar}
                    nombre_grupo={'Aletas'}
                    setCategoriaAAgregar={setCategoriaAAgregar}
                    agregarComponente={agregarComponente}
                    onClick={() => {
                        setCategoriaAAgregar(id_categoria_aleta);
                    }}
                />}
                <GrupoEnsamblado
                    banda={banda}
                    ensamblado_banda={ensamblado_banda}
                    componentes_para_agregar={componentes_para_agregar}
                    id_categoria={id_categoria_modulo}
                    categoria_a_agregar={categoria_a_agregar}
                    nombre_grupo={'Módulos'}
                    setCategoriaAAgregar={setCategoriaAAgregar}
                    agregarComponente={agregarComponente}
                    onClick={() => {
                        setCategoriaAAgregar(id_categoria_modulo);
                    }}
                />
                <GrupoEnsamblado
                    banda={banda}
                    ensamblado_banda={ensamblado_banda}
                    componentes_para_agregar={componentes_para_agregar}
                    id_categoria={id_categoria_varilla}
                    categoria_a_agregar={categoria_a_agregar}
                    nombre_grupo={'Varilla'}
                    setCategoriaAAgregar={setCategoriaAAgregar}
                    agregarComponente={agregarComponente}
                    onClick={() => {
                        setCategoriaAAgregar(id_categoria_varilla);
                    }}
                />
                <GrupoEnsamblado
                    banda={banda}
                    ensamblado_banda={ensamblado_banda}
                    componentes_para_agregar={componentes_para_agregar}
                    id_categoria={id_categoria_tapa}
                    categoria_a_agregar={categoria_a_agregar}
                    nombre_grupo={'Tapa'}
                    setCategoriaAAgregar={setCategoriaAAgregar}
                    agregarComponente={agregarComponente}
                    onClick={() => {
                        setCategoriaAAgregar(id_categoria_tapa);
                    }}
                />
            </div>
        </div>
    )
});

export default BandaEurobeltEnsamblado;