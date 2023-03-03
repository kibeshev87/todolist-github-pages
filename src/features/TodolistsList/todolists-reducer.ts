import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppReducerType, appSetErrorAC, appSetStatusAC, RequestStatusType} from "../../app/app-reducer";
import {AxiosError} from "axios";

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    isDisabled: RequestStatusType
}

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistReducerActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', isDisabled: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', isDisabled: 'idle'}))
        case 'TODOLIST/CHANGE-IS-DISABLED': {
            return state.map(el => el.id === action.todolistId
                ? {...el, isDisabled: action.status} : el)
        }
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)

export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const)

export const changeIsDisabledStatusAC = (todolistId: string, status: RequestStatusType) =>
    ({type: 'TODOLIST/CHANGE-IS-DISABLED', todolistId, status} as const)


// thunks
export const fetchTodolistsTC = () => (dispatch: Dispatch<TodolistReducerActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(appSetStatusAC('idle'))
        })
        .catch((err: AxiosError) => {
            dispatch(appSetErrorAC(err.message))
        })
        .finally(() => {
            dispatch(appSetStatusAC('idle'))
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<TodolistReducerActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    dispatch(changeIsDisabledStatusAC(todolistId, 'loading'))
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
            } else {
                dispatch(appSetErrorAC(res.data.messages[0]))
            }
        })
        .catch((err: AxiosError) => {
            dispatch(appSetErrorAC(err.message))
        })
        .finally(() => {
            dispatch(appSetStatusAC('idle'))
            dispatch(changeIsDisabledStatusAC(todolistId, 'idle'))
        })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch<TodolistReducerActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    todolistsAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
            } else {
                dispatch(appSetErrorAC(res.data.messages[0]))
            }
        })
        .catch((err: AxiosError) => {
            dispatch(appSetErrorAC(err.message))
        })
        .finally(() => {
            dispatch(appSetStatusAC('idle'))
        })
}

export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: Dispatch<TodolistReducerActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    todolistsAPI.updateTodolist(id, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC(id, title))
            } else {
                dispatch(appSetErrorAC(res.data.messages[0]))
            }
        })
        .catch((err: AxiosError) => {
            dispatch(appSetErrorAC(err.message))
        })
        .finally(() => {
            dispatch(appSetStatusAC('idle'))
        })
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type ChangeIsDisabledStatusACType = ReturnType<typeof changeIsDisabledStatusAC>

export type TodolistReducerActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | AppReducerType
    | ChangeIsDisabledStatusACType

