import "react-table/react-table.css";
import 'react-widgets/dist/css/react-widgets.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'tether/dist/js/tether';
import './../../css/custom.css';
import 'react-pivottable/pivottable.css';
import 'webdatarocks/webdatarocks.min.css';
import 'webdatarocks/webdatarocks.toolbar.min';
import 'react-tabs/style/react-tabs.css';

import {createMuiTheme} from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import indigo from '@material-ui/core/colors/indigo';


import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faCodeMerge,
    faEyeSlash,
    faBarcode,
    faReceipt,
    faAddressBook,
    faWrench,
    faCogs,
    faShoppingCart,
    faPuzzlePiece,
    faSignOut,
    faSpinnerThird,
    faBars,
    faHome,
    faAlarmClock,
    faAngleLeft,
    faAngleDown,
    faSearch,
    faProjectDiagram,
    faAngleUp,
    faTrash,
    faEdit,
    faEye,
    faUsers,
    faUser,
    faLock,
    faObjectGroup,
    faUserHardHat,
    faSuitcase,
    faMoneyBillAlt,
    faFile,
    faBook,
    faPlusCircle,
    faMinusCircle,
    faDownload,
    faSyncAlt,
    faTimes,
    faTimesCircle,
    faCheck,
    faSquare,
    faCheckSquare,
    faExclamation,
    faExclamationCircle,
    faCheckCircle,
    faTasks,
    faPlus,
    faQrcode,
    faDesktop,
    faMap,
    faExchangeAlt,
    faConveyorBelt,
    faComments,
    faSuitcaseRolling,
    faCoins,
    faLaptopCode,
    faInfoCircle,
    faPhone,
    faAt,
    faArrowCircleUp,
    faArrowCircleDown,
    faFileImage,
    faInboxOut,
    faThumbsDown,
    faThumbsUp,
    faHistory,
    faArrowsAlt,
    faChevronDown,
    faLink,
    faEraser,
    faPaste,
    faAnalytics,
    faAbacus
} from '@fortawesome/pro-solid-svg-icons';
import {far} from "@fortawesome/pro-regular-svg-icons";

library.add(far);

library.add(
    faEyeSlash,
    faBarcode,
    faAddressBook,
    faWrench,
    faCogs,
    faShoppingCart,
    faSuitcaseRolling,
    faPuzzlePiece,
    faSignOut,
    faSpinnerThird,
    faComments,
    faBars,
    faCoins,
    faHome,
    faAlarmClock,
    faAngleLeft,
    faAngleDown,
    faSearch,
    faProjectDiagram,
    faAngleUp,
    faTrash,
    faEdit,
    faEye,
    faUsers,
    faUser,
    faLock,
    faReceipt,
    faObjectGroup,
    faUserHardHat,
    faSuitcase,
    faMoneyBillAlt,
    faFile,
    faBook,
    faPlusCircle,
    faMinusCircle,
    faDownload,
    faSyncAlt,
    faTimes,
    faTimesCircle,
    faCheck,
    faSquare,
    faCheckSquare,
    faExclamation,
    faExclamationCircle,
    faCheckCircle,
    faTasks,
    faPlus,
    faQrcode,
    faDesktop,
    faMap,
    faExchangeAlt,
    faConveyorBelt,
    faLaptopCode,
    faInfoCircle,
    faPhone,
    faAt,
    faArrowCircleUp,
    faArrowCircleDown,
    faFileImage,
    faInboxOut,
    faThumbsDown,
    faThumbsUp,
    faHistory,
    faArrowsAlt,
    faChevronDown,
    faLink,
    faEraser,
    faPaste,
    faCodeMerge,
    faAnalytics,
    faAbacus
);


const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        fontSize: 12,
    },
    palette: {
        primary: orange,
        secondary: indigo,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
});

export default theme;