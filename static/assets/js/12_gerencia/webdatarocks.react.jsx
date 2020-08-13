import React, {useEffect, useRef, useState} from "react";
import * as WebDataRocks from "webdatarocks";
import "webdatarocks/webdatarocks.min.css";

export const Pivot2 = (props) => {
    let webdatarocks = null;
    let fragmentRef = useRef();
    const [slice, setSlice] = useState(props.report.slice);

    useEffect(() => {
        let config = {report: {slice}};
        config.container = fragmentRef.current;
        parseProps(config);
        webdatarocks = new WebDataRocks(config);
        return () => webdatarocks.dispose();
    }, [])

    useEffect(() => {
        let config = {report: {slice}};
        config.container = fragmentRef.current;
        parseProps(config);
        webdatarocks = new WebDataRocks(config);
        webdatarocks.refresh()
    }, [props.consulto])
    const parseProps = (config) => {
        if (props.toolbar !== undefined) {
            config.toolbar = props.toolbar;
        }
        if (props.width !== undefined) {
            config.width = props.width;
        }
        if (props.height !== undefined) {
            config.height = props.height;
        }
        if (props.report !== undefined) {
            config.report = {...props.report, slice};
        }
        if (props.global !== undefined) {
            config.global = props.global;
        }
        if (props.customizeCell !== undefined) {
            config.customizeCell = props.customizeCell;
        }
        // events
        if (props.cellclick !== undefined) {
            config.cellclick = props.cellclick;
        }
        if (props.celldoubleclick !== undefined) {
            config.celldoubleclick = props.celldoubleclick;
        }
        if (props.dataerror !== undefined) {
            config.dataerror = props.dataerror;
        }
        if (props.datafilecancelled !== undefined) {
            config.datafilecancelled = props.datafilecancelled;
        }
        if (props.dataloaded !== undefined) {
            config.dataloaded = props.dataloaded;
        }
        if (props.datachanged !== undefined) {
            config.datachanged = props.datachanged;
        }
        if (props.fieldslistclose !== undefined) {
            config.fieldslistclose = props.fieldslistclose;
        }
        if (props.fieldslistopen !== undefined) {
            config.fieldslistopen = props.fieldslistopen;
        }
        if (props.filteropen !== undefined) {
            config.filteropen = props.filteropen;
        }
        if (props.fullscreen !== undefined) {
            config.fullscreen = props.fullscreen;
        }
        if (props.loadingdata !== undefined) {
            config.loadingdata = props.loadingdata;
        }
        if (props.loadinglocalization !== undefined) {
            config.loadinglocalization = props.loadinglocalization;
        }
        if (props.loadingreportfile !== undefined) {
            config.loadingreportfile = props.loadingreportfile;
        }
        if (props.localizationerror !== undefined) {
            config.localizationerror = props.localizationerror;
        }
        if (props.localizationloaded !== undefined) {
            config.localizationloaded = props.localizationloaded;
        }
        if (props.openingreportfile !== undefined) {
            config.openingreportfile = props.openingreportfile;
        }
        if (props.querycomplete !== undefined) {
            config.querycomplete = props.querycomplete;
        }
        if (props.queryerror !== undefined) {
            config.queryerror = props.queryerror;
        }
        if (props.ready !== undefined) {
            config.ready = props.ready;
        }

        config.reportchange = () => {
            console.log(webdatarocks.getReport())
            setSlice(webdatarocks.getReport().slice)
        };

        if (props.reportcomplete !== undefined) {
            config.reportcomplete = props.reportcomplete;
        }
        if (props.reportfilecancelled !== undefined) {
            config.reportfilecancelled = props.reportfilecancelled;
        }
        if (props.reportfileerror !== undefined) {
            config.reportfileerror = props.reportfileerror;
        }
        if (props.reportfileloaded !== undefined) {
            config.reportfileloaded = props.reportfileloaded;
        }
        if (props.runningquery !== undefined) {
            config.runningquery = props.runningquery;
        }
        if (props.update !== undefined) {
            config.update = props.update;
        }
        if (props.beforetoolbarcreated !== undefined) {
            config.beforetoolbarcreated = props.beforetoolbarcreated;
        }
    }
    return (
        <div ref={fragmentRef}> Pivot </div>
    )
};


// export class Pivot extends Component {
//     webdatarocks;
//
//     render() {
//         return (
//             <div> Pivot </div>
//         )
//     }
//
//     componentDidMount() {
//         var config = {};
//         config.container = ReactDOM.findDOMNode(this);
//         this.parseProps(config);
//         this.webdatarocks = new WebDataRocks(config);
//     }
//
//     shouldComponentUpdate() {
//         return false;
//     }
//
//     componentWillUnmount() {
//         this.webdatarocks.dispose();
//     }
//
//     parseProps(config) {
//         if (this.props.toolbar !== undefined) {
//             config.toolbar = this.props.toolbar;
//         }
//         if (this.props.width !== undefined) {
//             config.width = this.props.width;
//         }
//         if (this.props.height !== undefined) {
//             config.height = this.props.height;
//         }
//         if (this.props.report !== undefined) {
//             config.report = this.props.report;
//         }
//         if (this.props.global !== undefined) {
//             config.global = this.props.global;
//         }
//         if (this.props.customizeCell !== undefined) {
//             config.customizeCell = this.props.customizeCell;
//         }
//         // events
//         if (this.props.cellclick !== undefined) {
//             config.cellclick = this.props.cellclick;
//         }
//         if (this.props.celldoubleclick !== undefined) {
//             config.celldoubleclick = this.props.celldoubleclick;
//         }
//         if (this.props.dataerror !== undefined) {
//             config.dataerror = this.props.dataerror;
//         }
//         if (this.props.datafilecancelled !== undefined) {
//             config.datafilecancelled = this.props.datafilecancelled;
//         }
//         if (this.props.dataloaded !== undefined) {
//             config.dataloaded = this.props.dataloaded;
//         }
//         if (this.props.datachanged !== undefined) {
//             config.datachanged = this.props.datachanged;
//         }
//         if (this.props.fieldslistclose !== undefined) {
//             config.fieldslistclose = this.props.fieldslistclose;
//         }
//         if (this.props.fieldslistopen !== undefined) {
//             config.fieldslistopen = this.props.fieldslistopen;
//         }
//         if (this.props.filteropen !== undefined) {
//             config.filteropen = this.props.filteropen;
//         }
//         if (this.props.fullscreen !== undefined) {
//             config.fullscreen = this.props.fullscreen;
//         }
//         if (this.props.loadingdata !== undefined) {
//             config.loadingdata = this.props.loadingdata;
//         }
//         if (this.props.loadinglocalization !== undefined) {
//             config.loadinglocalization = this.props.loadinglocalization;
//         }
//         if (this.props.loadingreportfile !== undefined) {
//             config.loadingreportfile = this.props.loadingreportfile;
//         }
//         if (this.props.localizationerror !== undefined) {
//             config.localizationerror = this.props.localizationerror;
//         }
//         if (this.props.localizationloaded !== undefined) {
//             config.localizationloaded = this.props.localizationloaded;
//         }
//         if (this.props.openingreportfile !== undefined) {
//             config.openingreportfile = this.props.openingreportfile;
//         }
//         if (this.props.querycomplete !== undefined) {
//             config.querycomplete = this.props.querycomplete;
//         }
//         if (this.props.queryerror !== undefined) {
//             config.queryerror = this.props.queryerror;
//         }
//         if (this.props.ready !== undefined) {
//             config.ready = this.props.ready;
//         }
//         if (this.props.reportchange !== undefined) {
//             config.reportchange = this.props.reportchange;
//         }
//         if (this.props.reportcomplete !== undefined) {
//             config.reportcomplete = this.props.reportcomplete;
//         }
//         if (this.props.reportfilecancelled !== undefined) {
//             config.reportfilecancelled = this.props.reportfilecancelled;
//         }
//         if (this.props.reportfileerror !== undefined) {
//             config.reportfileerror = this.props.reportfileerror;
//         }
//         if (this.props.reportfileloaded !== undefined) {
//             config.reportfileloaded = this.props.reportfileloaded;
//         }
//         if (this.props.runningquery !== undefined) {
//             config.runningquery = this.props.runningquery;
//         }
//         if (this.props.update !== undefined) {
//             config.update = this.props.update;
//         }
//         if (this.props.beforetoolbarcreated !== undefined) {
//             config.beforetoolbarcreated = this.props.beforetoolbarcreated;
//         }
//     }
//
// }

// Pivot.propTypes = {
//     global: PropTypes.object,
//     width: [PropTypes.string, PropTypes.number],
//     height: [PropTypes.string, PropTypes.number],
//     report: [PropTypes.string, PropTypes.object],
//     toolbar: PropTypes.bool,
//     customizeCell: PropTypes.func,
//     cellclick: PropTypes.func,
//     celldoubleclick: PropTypes.func,
//     dataerror: PropTypes.func,
//     datafilecancelled: PropTypes.func,
//     dataloaded: PropTypes.func,
//     datachanged: PropTypes.func,
//     fieldslistclose: PropTypes.func,
//     fieldslistopen: PropTypes.func,
//     filteropen: PropTypes.func,
//     fullscreen: PropTypes.func,
//     loadingdata: PropTypes.func,
//     loadinglocalization: PropTypes.func,
//     loadingreportfile: PropTypes.func,
//     localizationerror: PropTypes.func,
//     localizationloaded: PropTypes.func,
//     openingreportfile: PropTypes.func,
//     querycomplete: PropTypes.func,
//     queryerror: PropTypes.func,
//     ready: PropTypes.func,
//     reportchange: PropTypes.func,
//     reportcomplete: PropTypes.func,
//     reportfilecancelled: PropTypes.func,
//     reportfileerror: PropTypes.func,
//     reportfileloaded: PropTypes.func,
//     runningquery: PropTypes.func,
//     update: PropTypes.func,
//     beforetoolbarcreated: PropTypes.func
// };