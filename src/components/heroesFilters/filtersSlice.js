import {createAsyncThunk, createSlice, createEntityAdapter} from "@reduxjs/toolkit";
import {useHttp} from "../../hooks/http.hook";

const filtersAdapter = createEntityAdapter({
    selectId: (filter) => filter.name
});

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
})

export const fetchFilters = createAsyncThunk(
    'filters/fetch',
    () => {
        const {request} = useHttp();
        return request("http://localhost:3001/filters")
    }
);

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'})
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filtersAdapter.setAll(state, action.payload);
            })
            .addCase(fetchFilters.rejected, state => {state.filtersLoadingStatus = 'error'})
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = filterSlice;

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters)
//так делать нельзя т.к. стор еще не сформирован
//export const {getFilters} = selectAll(store.getState());
export default reducer;
export const {
    activeFilterChanged
} = actions;