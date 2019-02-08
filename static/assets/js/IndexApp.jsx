import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "./01_actions/01_index";
import Loading from "./00_utilities/components/system/loading_overlay";
import CargarDatos from "./00_utilities/components/system/cargar_datos";
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withStyles} from "@material-ui/core/styles/index";
import Typography from '@material-ui/core/Typography';

const Boton = (props) => {
    const {nombre, icono, link, classes} = props;
    return (
        <div className={'col-6 col-md-4 mt-3'}>
            <Link to={link}>
                <div className={classes.bordeBoton}>
                    <div className="row">
                        <div className="col-12">
                            <FontAwesomeIcon icon={['fas', icono]} size='3x' className={classes.iconoBoton}/>
                        </div>
                        <div className="col-12">
                            <Typography variant="h6" color="primary" noWrap>
                                {nombre}
                            </Typography>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
};

class IndexApp extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.error_callback = this.error_callback.bind(this);
    }

    componentDidMount() {
        this.cargarDatos()
    }

    error_callback(error) {
        this.props.notificarErrorAjaxAction(error);
    }

    notificar(mensaje) {
        this.props.notificarAction(mensaje);
    }


    cargarDatos() {
        this.props.cargando();
        this.props.fetchMiCuenta(() => this.props.noCargando(), this.error_callback);
    }

    render() {
        const {mi_cuenta: {is_staff, is_superuser}, classes} = this.props;
        return <Loading>
            <div className="mt-3">
                <div className="container text-center">
                    <div className="row">
                        <div className="col-12 p-5">
                            <img className='img-fluid' src={`${img_static_url}/logo.png`} alt=""/>
                        </div>
                        {
                            (is_staff || is_superuser) &&
                            <Boton
                                nombre='Admin'
                                link='/app/admin/'
                                icono='cogs'
                                classes={classes}
                            />
                        }
                        <Boton
                            nombre='Proyectos'
                            link='/app/proyectos/'
                            icono='wrench'
                            classes={classes}
                        />
                        <Boton
                            nombre='Ventas'
                            link='/app/ventas/'
                            icono='shopping-cart'
                            classes={classes}
                        />
                        <Boton
                            nombre='Bandas'
                            link='/app/bandas/'
                            icono='puzzle-piece'
                            classes={classes}
                        />
                        <div className="col-4"></div>
                        <div className="col-4 boton-index mt-4">
                            <a href="/accounts/logout/?next=/">
                                <div className='icono puntero'>
                                    <div className="row">
                                        <div className="col-12">
                                            <FontAwesomeIcon
                                                icon={['fas', 'sign-out-alt']}
                                                className={classes.iconoBoton}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <Typography variant="h6" color="primary" noWrap>
                                                Salir
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-4"></div>
                        <CargarDatos cargarDatos={this.cargarDatos}/>
                    </div>
                </div>
            </div>
        </Loading>
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        mi_cuenta: state.mi_cuenta
    }
}

const styles = theme => (
    {
        iconoBoton: {
            color: theme.palette.primary.dark
        },
        bordeBoton: {
            borderRadius: '25px',
            border: `2px solid ${theme.palette.primary.dark}`,
            padding: '1rem',
            width: '100%'
        }
    })
;

export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(IndexApp));