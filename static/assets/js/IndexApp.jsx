import React, {memo, useState} from 'react';
import Loading from "./00_utilities/components/system/LoadingOverlay";
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {makeStyles} from "@material-ui/core/styles/index";
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import useTengoPermisos from "./00_utilities/hooks/useTengoPermisos";
import {MODULO_PERMISSIONS} from "./permisos";
import * as actions from './01_actions/01_index';
import {useDispatch} from 'react-redux';
import DistribucionHoraHojaTrabajoDialog
    from './04_app_proyectos/mano_obra/hojas_trabajo/DistribucionHoraHojaTrabajoDialog';

const Boton = memo(props => {
    const {nombre, icono, link, classes} = props;
    return (
        <div className={'col-6 col-md-4 mt-3'}>
            <Link to={link} className={classes.botonAnimado}>
                <div className={[classes.bordeBoton, classes.botonAnimado].join(' ')}>
                    <div className="row">
                        <div className="col-12">
                            <FontAwesomeIcon icon={icono} size='3x' className={classes.iconoBoton}/>
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
});

const useStyles = makeStyles(theme => ({
    iconoBoton: {
        color: theme.palette.primary.dark
    },
    bordeBoton: {
        borderRadius: '25px',
        border: `2px solid ${theme.palette.primary.dark}`,
        padding: '1rem',
        width: '100%'
    },
    botonAnimado: {
        transition: '0.3s',
        '&:hover': {
            textDecoration: 'none',
            zIndex: '100',
            webkitTransform: 'scale(1.1)',
            msTransform: 'scale(1.1)',
            transform: 'scale(1.1)'
        }
    }
}));


const IndexApp = memo(props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const mi_cuenta = JSON.parse(localStorage.getItem('mi_cuenta'));
    const {is_superuser} = mi_cuenta;
    const [prueba, setPrueba] = useState(false);
    const permisos_modulos = useTengoPermisos(MODULO_PERMISSIONS);
    const {
        modulo_admin,
        modulo_proyectos,
        modulo_ventas,
        modulo_ventas_componentes,
        modulo_medios,
        modulo_sistemas,
        modulo_contabilidad,
        modulo_bandas_eurobelt
    } = permisos_modulos;
    return <Loading>
        <div className="mt-3">
            <div className="container text-center">
                <div className="row">
                    <div className="col-12 p-5">
                        <img className='img-fluid' src={`${img_static_url}/logo.png`} alt=""/>
                    </div>
                    {/*<span onClick={() => setPrueba(true)}>DAR CLICK AQUI</span>*/}
                    {/*{prueba && <DistribucionHoraHojaTrabajoDialog open={prueba} onCancel={() => setPrueba(false)}/>}*/}
                    {modulo_admin && <Boton
                        nombre='Admin'
                        link='/app/admin/'
                        icono='cogs'
                        classes={classes}
                    />}
                    {modulo_proyectos && <Boton
                        nombre='Proyectos'
                        link='/app/proyectos/'
                        icono='wrench'
                        classes={classes}
                    />}
                    {modulo_ventas && <Boton
                        nombre='Ventas Proyectos'
                        link='/app/ventas_proyectos/'
                        icono='shopping-cart'
                        classes={classes}
                    />}
                    {modulo_ventas_componentes && <Boton
                        nombre='Ventas Componentes'
                        link='/app/ventas_componentes/'
                        icono='shopping-cart'
                        classes={classes}
                    />}
                    {modulo_bandas_eurobelt && <Boton
                        nombre='Bandas Eurobelt'
                        link='/app/bandas/'
                        icono='puzzle-piece'
                        classes={classes}
                    />}
                    {modulo_medios && <Boton
                        nombre='Medios'
                        link='/app/medios/'
                        icono='desktop'
                        classes={classes}
                    />}
                    {modulo_sistemas && <Boton
                        nombre='Sistemas'
                        link='/app/sistemas/'
                        icono='laptop-code'
                        classes={classes}
                    />}
                    {modulo_contabilidad && <Boton
                        nombre='Contabilidad'
                        link='/app/contabilidad/'
                        icono='coins'
                        classes={classes}
                    />}
                    <div className='col-12'>
                        <div className="row">
                            <div className="col-4"></div>
                            <div
                                className={classNames(classes.bordeBoton, 'col-4 mt-3')}
                            >
                                <div className='icono puntero'
                                     onClick={() => {
                                         dispatch(actions.logout());
                                     }}
                                >
                                    <div className="row">
                                        <div className="col-12">
                                            <FontAwesomeIcon
                                                icon={'sign-out'}
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
                            </div>
                            <div className="col-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Loading>
});

export default IndexApp;