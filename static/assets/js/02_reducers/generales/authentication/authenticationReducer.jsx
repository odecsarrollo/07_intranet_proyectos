import axios from "axios";

const initialState = {
    mi_cuenta: JSON.parse(localStorage.getItem("mi_cuenta")),
    mis_permisos: JSON.parse(localStorage.getItem("mis_permisos")),
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: true,
    user: {
        username: null,
        email: null,
        date_of_birth: null,
        first_name: null,
        is_staff: false,
        is_active: false,
        is_superuser: false,
        last_name: null,
        password: null,
        profile_image_url: null,
        to_string: null,
        user_permissions: null,
        groups: null,
        id: null
    },
    errors: {},
};


export default function auth(state = initialState, action) {
    switch (action.type) {

        case 'USER_LOADING':
            return {...state, isLoading: true};

        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.user,
            };
        case 'NOT_USER_LOADED':
            axios.defaults.headers = _.omit(axios.defaults.headers, 'Authorization');
            localStorage.removeItem("token");
            localStorage.removeItem("my_permissions");
            localStorage.removeItem("user");
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                user: null,
            };
        case 'LOGIN_SUCCESSFUL':
            const token = action.data.token;
            localStorage.setItem("token", token);
            localStorage.setItem("mis_permisos", []);
            axios.defaults.headers["Authorization"] = `Token ${token}`;
            return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null};

        case 'AUTHENTICATION_ERROR':
        case 'LOGIN_FAILED':
        case 'LOGOUT_SUCCESSFUL':
            axios.defaults.headers = _.omit(axios.defaults.headers, 'Authorization');
            localStorage.removeItem("token");
            localStorage.removeItem("mis_permisos");
            localStorage.removeItem("user");
            return _.omit({
                ...state,
                errors: action.data,
                user: initialState.user,
                isAuthenticated: false,
                isLoading: false,
            }, ['token', 'my_permissions', 'user']);
        case 'CLEAR_PERMISSIONS':
            localStorage.removeItem("mis_permisos");
            return state;
        default:
            return state;
    }
}