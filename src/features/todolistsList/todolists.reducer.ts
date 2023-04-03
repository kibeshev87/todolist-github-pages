import {todolistsApi, TodolistType} from 'api/todolists.api'
import {appActions, RequestStatusType} from 'app/app.reducer'
import {handleServerNetworkError} from 'utils/error-utils'
import {AppThunk} from 'app/store';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolist',
    initialState,
    reducers: {

        removeTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index !== -1) state.splice(index, 1)
        },

        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },

        changeTodolistTitle: (state, action: PayloadAction<{ todolistId: string, title: string }>) => {
            const todo = state.find(tl => tl.id === action.payload.todolistId)
            if (todo) {
                todo.title = action.payload.title
            }
        },

        changeTodolistFilter: (state, action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) => {
            const todo = state.find(tl => tl.id === action.payload.todolistId)
            if (todo) {
                todo.filter = action.payload.filter
            }
        },

        changeTodolistEntityStatus: (state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) => {
            const todo = state.find(tl => tl.id === action.payload.todolistId)
            if (todo) {
                todo.entityStatus = action.payload.entityStatus
            }
        },

        setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }
    }
})


export const todolistsReducer = slice.reducer
export const todolistActions = slice.actions


export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsApi.getTodolists()
            .then((res) => {
                dispatch(todolistActions.setTodolists({todolists: res.data}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
            .finally(() => {
                dispatch(appActions.setAppStatus({status: 'idle'}))
            })
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        dispatch(todolistActions.changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}))
        todolistsApi.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(todolistActions.removeTodolist({todolistId}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
            .finally(() => {
                dispatch(appActions.setAppStatus({status: 'idle'}))
            })
            .finally(() => {
                dispatch(appActions.setAppStatus({status: 'idle'}))
            })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsApi.createTodolist(title)
            .then((res) => {
                dispatch(todolistActions.addTodolist({todolist: res.data.data.item}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
            .finally(() => {
                dispatch(appActions.setAppStatus({status: 'idle'}))
            })
    }
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsApi.updateTodolist(todolistId, title)
            .then((res) => {
                dispatch(todolistActions.changeTodolistTitle({todolistId, title}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
            .finally(() => {
                dispatch(appActions.setAppStatus({status: 'idle'}))
            })
    }
}

