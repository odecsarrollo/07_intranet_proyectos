import React, {Component} from 'react';
import Loading from "./00_utilities/components/system/loading_overlay";
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withStyles} from "@material-ui/core/styles/index";
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';

const Boton = (props) => {
    const {nombre, icono, link, classes} = props;
    return (
        <div className={'col-6 col-md-4 mt-3'}>
            <Link to={link}>
                <div className={classes.bordeBoton}>
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
};

class IndexApp extends Component {
    render() {
        const {classes} = this.props;
        const mi_cuenta = JSON.parse(localStorage.getItem('mi_cuenta'));
        const {is_staff, is_superuser} = mi_cuenta;
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
                        <div className="col-4">

                        </div>
                        <div className='col-12'>
                            <div className="row">
                                <div className="col-4"></div>
                                <div
                                    className={classNames(classes.bordeBoton, 'col-4 mt-3')}
                                >
                                    <div className='icono puntero'
                                         onClick={() => {
                                             this.props.logout();
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

export default withStyles(styles, {withTheme: true})(IndexApp);