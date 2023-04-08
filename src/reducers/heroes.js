import {createReducer} from "@reduxjs/toolkit";

// импортируем actionCreater'ы для привязки к reducer'ам и избегания дублирования их названия (HEROES_FETCHING)
import {
    heroesFetched,
    heroesFetching,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} from "../actions";

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'
}

const heroes = createReducer(initialState, {
        // динамически создаем ключ
        // нельзя писать state => state.heroesLoadingStatus = 'loading' т.к. это сокращенный return (нарушает иммутабельность)
        [heroesFetching]: state => {
            state.heroesLoadingStatus = 'loading'
        },
        [heroesFetched]: (state, action) => {
            state.heroesLoadingStatus = 'idle';
            state.heroes = action.payload;
        },
        [heroesFetchingError]: state => {
            state.heroesLoadingStatus = 'error'
        },
        [heroCreated]: (state, action) => {
            state.heroes.push(action.payload);
        },
        [heroDeleted]: (state, action) => {
            state.heroes.filter(item => item.id !== action.payload)
        }
    },
    // массив функций сравнения (пока не нужен)
    [],
    // дефолтный случай, возвращает state
    state => state
)

// builder помогает конструировать Reducer с помощью встроенных методов
// const heroes = createReducer(initialState, builder => {
//     builder
//         //аналог case в обычном reducer
//         // принимает в себя actionCreater и функцию по изменению state
//         .addCase(heroesFetching, state => {
//             // тут НЕ изменяется сам state
//             // при использовании tollkit внутренняя библиотека innerJs сама поймёт код и сохранит принцип имутабельности
//             // функция НИЧЕГО НЕ возвращает иначе функция подумает, что возвращается state и не будет заботится о его имутабельности
//             state.heroesLoadingStatus = 'loading';
//             // но если нужно вернуть, то пишем как раньше и заботимся о имутабельности сами
//             // return {
//             //      ...state,
//             //     heroesLoadingStatus: 'loading'
//             // }
//         })
//         .addCase(heroesFetched, (state, action) => {
//             state.heroesLoadingStatus = 'idle';
//             state.heroes = action.payload;
//         })
//         .addCase(heroesFetchingError, state => {
//             state.heroesLoadingStatus = 'error';
//         })
//         .addCase(heroCreated, (state, action) => {
//             state.heroes.push(action.payload);
//         })
//         .addCase(heroDeleted, (state, action) => {
//             state.heroes = state.heroes.filter(item => item.id !== action.payload);
//         })
//         // дефолтный случай - обычно пустая функция
//         .addDefaultCase(() => {});
// })

// const heroes = (state = initialState, action) => {
//     switch (action.type) {
//         case 'HEROES_FETCHING':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'loading'
//             }
//         case 'HEROES_FETCHED':
//             return {
//                 ...state,
//                 heroes: action.payload,
//                 filteredHeroes: action.payload,
//                 heroesLoadingStatus: 'idle'
//             }
//         case 'HEROES_FETCHING_ERROR':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'error'
//             }
//         case 'HERO_CREATED':
//             return {
//                 ...state,
//                 heroes: [...state.heroes, action.payload]
//             }
//         case 'HERO_DELETED':
//             return {
//                 ...state,
//                 heroes: state.heroes.filter(item => item.id !== action.payload)
//             }
//         default: return state
//     }
// }

export default heroes;