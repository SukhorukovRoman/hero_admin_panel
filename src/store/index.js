import {configureStore} from "@reduxjs/toolkit";
//получаем наш reducer из heroesSlice и называем как heroes
import filters from "../components/heroesFilters/filtersSlice";
import {apiSlice} from "../api/apiSlice";

// функция автоматически получает store (не весь store, в нем только dispatch и getState)
const stringMiddleware = (store) => {
    // функция возвращает другую функцию, которая автоматически получает dispatch
    return (next) => {
        // а эта функция вернет другую функцию, которая в себя принимает action
        // это и есть новая функция dispatch с измененным функционалом
        return (action) => {
            if (typeof action === 'string') {
                return next({
                    type: action
                })
            }
            return next(action)
        }
    }
}

const enhancer = (createStore) => {
    return (...args) => {
        const store = createStore(...args);
        //Сохраним оригинальный dispatch
        const oldDispatch = store.dispatch;
        //Переопределяем оригинальный dispatch
        store.dispatch = (action) => {
            if (typeof action === 'string') {
                return oldDispatch({
                    type: action
                })
            } else {
                return oldDispatch(action)
            }
        }
        return store;
    }
}

// const store = createStore(
//     combineReducers({heroes, filters}),
//     compose(
//         applyMiddleware(ReduxThunk, stringMiddleware),
//         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//     )
// );

const store = configureStore({
    reducer: {filters, [apiSlice.reducerPath]: apiSlice.reducer},
    // getDefaultMiddleware включает:
    // serializableStateInvariant - проверяет, что в store нет данных, которых там не должны быть (символы, функции и т.п.)
    // immutableStateInvariant - обнаруживает мутации, которые могут возникнуть в нашем store
    // thunk = встроенный ReduxThunk
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware, apiSlice.middleware),
    //включаем только в билде который НЕ продакшн
    devTools: process.env.NODE_ENV !== 'production',
})

export default store;