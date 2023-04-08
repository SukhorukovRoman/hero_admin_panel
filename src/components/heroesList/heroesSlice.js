import {createSlice, createAsyncThunk, createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {useHttp} from "../../hooks/http.hook";

// вернет объект с готовыми методами, селекторами и колбэками и т.п.
// при своем создании адаптер может принять объект с колбэками
// selectId: (book) => book.bookId, - по стандарту id берется из пршидших данных поля id (c этой ф-ей можно переназначить на другое поле)
// sortComparer: (a, b) => a.title.localeCompare(b.title), - отвечает за сортировку
const heroesAdapter = createEntityAdapter();

// heroesAdapter используется для начального состояния
const initialState = heroesAdapter.getInitialState({
    // getInitialState верент следующую структуру
    // {
    //     entities:{}
    //     ids:[]
    // }
    // мы можем ДОБАВИТЬ доп поля передав объект к ними
    heroesLoadingStatus: 'idle'
    // список heroes будет в entities
});



export const fetchHeroes = createAsyncThunk(
    // тип действия в формате: имя среза/тип действия
    'heroes/fetch',
    // функция возвращающая промис (асинхронный код)
    // принимает 2 аргумента
    // 1- то что приходит при dispatch'е этого действия - например id при удалении героя
    // 2 - api самого AsyncThunk (объект параметров: dispatch, getState и т.п.) (редко нужно)
    () => {
        // можно писать и синхронный код, но тогда надо самому выбрасывать ошибку throw Error
        const {request} = useHttp();
        // нужно именно вернуть промис, поэтому пишем return
        return request("http://localhost:3001/heroes")
        // В результате возвращается 3 actionCreater'a  pending, fulfilled, и rejected (названия как и состояния промиса)
    }
);

// Принимает 4 аргумента
// name- имя нашего среза (пространство имен создаваемых действий - action'ов)
// initialState - начальное состояние
// reducers - объект с обработчиками
// extraReducers - объект, который содержит reducer'ы другого среза (нужен в случае обновления объекта другого среза)
// в данном случае если хотели поменять что-то в фильтрах
const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        // Можно удалить т.к. использовалось только в fetchHeroes

        // heroesFetching: state => {state.heroesLoadingStatus = 'loading'},
        // heroesFetched: (state, action) => {
        //     state.heroesLoadingStatus = 'idle';
        //     state.heroes = action.payload;
        // },
        // heroesFetchingError: state => {
        //     state.heroesLoadingStatus = 'error'
        // },
        heroCreated: (state, action) => {
            heroesAdapter.addOne(state, action.payload)
        },
        heroDeleted: (state, action) => {
                                            // удаляем по id
            heroesAdapter.removeOne(state, action.payload)
        }
    },
    // т.к. fetchHeroes создается вне нашего slice, он считается сторонним и его передаем в extraReducer
    extraReducers: (builder) => {
        builder
                    // pending - запрос только формируется/отправляется
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})
                    // pending - промис выполнился успешно
            // даные из промиса автоматически попадут в action.payload
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                //принимаем массив новых сущностей и заменяет им все старые
                // 1й аргумент  - то куда помещаем данные
                // 2й аргумент - то что будем помещать/чем будем заменять
                heroesAdapter.setAll(state, action.payload);
            })
                    // rejected - промис выполнился с ошибкой
            .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})
            .addDefaultCase(() => {})
    }

})

// createSlice вернет 3 разных сущности:
// Имя нашего среза
// Объект с экшенами
// reducer
const {actions, reducer} = heroesSlice;

export default reducer;

                                        //указываем, что селекторы привязаны к героям
const {selectAll} = heroesAdapter.getSelectors(state => state.heroes)

export const filteredHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,
    // selectAll так-же получит наш state и так-же вернет массив с данными (героями) который нам нужен
    selectAll,
    //функция принимает в себя значения переданные выше в createSelector
    (filter, heroes) => {
        console.log('render')
        if (filter === 'all') {
            return heroes;
        } else {
            return heroes.filter(item => item.element === filter)
        }
    }
)

// деструктуризируем actions созданные в createSlice
export const {
    heroCreated,
    heroDeleted
} = actions;

