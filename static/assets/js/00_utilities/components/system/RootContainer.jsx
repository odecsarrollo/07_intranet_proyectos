import React, {Fragment, Suspense, useEffect, memo, useState} from "react";

import {useAuth} from "../../hooks/useAuth";
import {useSelector} from "react-redux";
import Login from "../../../authentication/login/Login";
import NotificationSystem from '../../../00_utilities/components/system/Notifications';
import CurrentRouteManager from "./CurrentRouteManager";
import PropTypes from "prop-types";

import {useDispatch} from "react-redux";
import {fetchMisPermisos, loadUser} from "../../../01_actions/01_index";
import axios from "axios";


let RootContainer = memo(props => {
    const authentication = useAuth();
    const [has_permissions, setHasPermissions] = useState(false);
    const dispatch = useDispatch();
    const {children, onReloadApp} = props;
    const {auth: {isAuthenticated, isLoading}} = authentication;
    const notifications = useSelector(state => state.notifications);
    useEffect(() => {
        if (localStorage.token) {
            axios.defaults.headers["Authorization"] = `Token ${localStorage.token}`;
        }
        if (isAuthenticated) {
            dispatch(loadUser());
            dispatch(fetchMisPermisos({
                callback: (res) => {
                    const my_downloaded_permissions = res.map(e => e.codename);
                    localStorage.setItem('mis_permisos', JSON.stringify(my_downloaded_permissions));
                    setHasPermissions(true)
                }
            }));
        } else {
            setHasPermissions(false)
        }
    }, [isAuthenticated]);
    if (isLoading) {
        return <div className='m-5 p-5'>Esta cargando...</div>
    }
    if (!isAuthenticated) {
        return <Login/>
    }
    if (has_permissions) {
        return (
            <Fragment>
                <NotificationSystem notifications={notifications}/>
                <CurrentRouteManager onReloadApp={onReloadApp}/>
                <Suspense fallback={<div>Loading...</div>}>
                    {children}
                </Suspense>
            </Fragment>
        )
    }
    return null
});

RootContainer.propTypes = {
    children: PropTypes.element.isRequired,
    onReloadApp: PropTypes.func
};

export default RootContainer;