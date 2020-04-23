import React, {useState, useEffect, memo} from "react";
import {withRouter} from "react-router-dom";

const CurrentRouteManager = (props) => {
    const [path, setPath] = useState(props.location.pathname);
    useEffect(() => {
        const current_path_root = props.location.pathname.split('/').slice(1, 3);
        const last_path_root = path.split('/').slice(1, 3);
        if (!_.isEqual(current_path_root, last_path_root)) {
            setPath(props.location.pathname);
        }
    }, [props.location.pathname]);
    return null
};
export default withRouter(memo(CurrentRouteManager))