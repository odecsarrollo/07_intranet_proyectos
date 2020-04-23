import {applyMiddleware, createStore} from "redux";
import ReduxPromise from "redux-promise";
import thunk from "redux-thunk";
import reducers from "./02_reducers";

const configureStoreDev = () => {
    const createStoreWithMiddleware = applyMiddleware(
        ReduxPromise,
        thunk
    )(createStore);
    const store = createStoreWithMiddleware(reducers);
    if (module.hot) {
        module.hot.accept('./02_reducers', () => {
            const nextRootReducer = require('./02_reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }
    return store;
};
const configureStoreProd = () => {
    const createStoreWithMiddleware = applyMiddleware(ReduxPromise, thunk)(createStore);
    return createStoreWithMiddleware(reducers);
};
const store = process.env.NODE_ENV === 'production' ? configureStoreProd() : configureStoreDev();
export default store;