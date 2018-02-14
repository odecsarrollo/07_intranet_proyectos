import React from 'react';

const LoadingOverlay = (props) => {
    const {cargando} = props;
    let isActive = cargando ? 'block' : 'none';
    const style = {
        display: isActive
    };
    return (
        <div className="loading-overload-uno">
            <div className="loading-overload-dos" style={style}>
                <div className="loading-overload-tres">
                    <i className="fas fa-spinner-third fa-spin"></i>
                    <div>
                        Cargando...
                    </div>
                </div>
            </div>
            {props.children}
        </div>
    )
};

export default LoadingOverlay;