import {
    AddTodolistActionType,
    changeIsDisabledStatusAC,
    RemoveTodolistActionType,
    SetTodolistsActionType,
    TodolistReducerActionsType
} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {AppReducerType, appSetErrorAC, appSetStatusAC, RequestStatusType} from "../../app/app-reducer";
import {AxiosError} from "axios";

export type TasksStateType = {
    [key: string]: Array<DomainTaskType>
}
export type DomainTaskType = TaskType & {
    isDisabled: RequestStatusType
}

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TaskReducerActionsType): TasksStateType => {
    switch (action.type) {

        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [{...action.task, isDisabled: 'idle'}, ...state[action.task.todoListId]]
            }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS':
            return {
                ...state, [action.todolistId]: action.tasks.map(el => ({...el, isDisabled: 'idle'}))
            }
        case "TASK/IS-DISABLED": {
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(el => el.id === action.taskId ? {...el, isDisabled: action.status} : el)
            }
        }

        default:
            return state
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)
export const changeIsDisabledTaskAC = (todolistId: string, taskId: string, status: RequestStatusType) =>
    ({type: 'TASK/IS-DISABLED', todolistId, taskId, status} as const)


// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<TaskReducerActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
            dispatch(appSetStatusAC('idle'))
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<TaskReducerActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    dispatch(changeIsDisabledTaskAC(todolistId, taskId, 'loading'))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
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

export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<TaskReducerActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
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

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch<TaskReducerActionsType>, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }
        dispatch(appSetStatusAC('loading'))
        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(taskId, domainModel, todolistId))
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
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

type TaskReducerActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
    | AppReducerType
    | ReturnType<typeof changeIsDisabledTaskAC>
    | TodolistReducerActionsType
