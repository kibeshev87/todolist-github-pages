import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {AuthReducerActionType, setIsLoginAC, SetIsLoginACType} from "../features/Login/authReducer";
import {AxiosError} from "axios";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppReducerType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS': {
            return {...state, status: action.status}
        }
        case "APP/SET-ERROR": {
            return {...state, error: action.error}
        }
        case "APP/IS-INITIALIZED": {
            return {...state, isInitialized: action.isInitialized}
        }

        default:
            return state
    }
}

export type AppReducerType = AppSetStatusACType | AppSetErrorACType | SetIsLoginACType | IsInitializedACType

export type AppSetStatusACType = ReturnType<typeof appSetStatusAC>
export type AppSetErrorACType = ReturnType<typeof appSetErrorAC>
export type IsInitializedACType = ReturnType<typeof isInitializedAC>

export const appSetStatusAC = (status: RequestStatusType) =>
    ({type: 'APP/SET-STATUS', status} as const)

export const isInitializedAC = (isInitialized: boolean) =>
    ({type: 'APP/IS-INITIALIZED', isInitialized} as const)

export const appSetErrorAC = (error: null|string) =>
    ({type: 'APP/SET-ERROR', error} as const)


export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(appSetStatusAC('loading'))
    authAPI.authMe()
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoginAC(true))
            } else {
                dispatch(appSetErrorAC(res.data.messages[0]))
            }
        })
        .catch((err: AxiosError) => {
            dispatch(appSetErrorAC(err.message))
        })
        .finally(() => {
            dispatch(appSetStatusAC('idle'))
            dispatch(isInitializedAC(true))
        })
}

