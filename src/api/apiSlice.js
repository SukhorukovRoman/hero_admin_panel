import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    // т.к. мы сейчас создаем срез (кусочек какого-то функционала) который будет включатся в store
    // поэтому первой настройкой укажем пространство имен (название reducer)
    // данные будет в store.api (api дефолтное название)
    reducerPath: 'api',
    // метод, который будет делать запрос
    baseQuery: fetchBaseQuery({
        // адрес куда по умолчанию уходит запрос
        baseUrl: 'http://localhost:3001'
    }),
    // указываем какие теги существуют в нашем api
    // навесили на одну функцию один тег и на какие-то данные другой тег
    // и говорим, что теперь это функция будет работать по тегу только с этими данными
    tagTypes: ['Heroes'],
    // операции которые будем проводить по базовому адресу
    // тут будут два типа действий:
    // query - запросы которые получают данные и сохраняют их
    // mutation - запросы на изменение данных на сервере
    endpoints: builder => ({
        // возвращаем объект
        getHeroes: builder.query({
            // возвращает строку куда делаем запрос
            query: () => '/heroes',
            // обозначим к какому тегу относятся запрашиваемые данные
            providesTags: ['Heroes']
        }),
        // это мутация т.к. изменяем данные
        createHero: builder.mutation({
            query: hero => ({
                // возвращаем объект
                url: '/heroes',
                method: 'POST',
                // автоматически будет превращен в JSON формат
                body: hero
            }),
            // Если происходит мутация указываем какие данные загрузить повторно
            invalidatesTags: ['Heroes']
        }),
        deleteHero: builder.mutation({
            query: id => ({
                url: `/heroes/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Heroes']
        })
    })
})


export const {useGetHeroesQuery, useCreateHeroMutation, useDeleteHeroMutation} = apiSlice;