import {AppReducerType, appSetErrorAC, appSetStatusAC} from "../../app/app-reducer";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {AxiosError} from "axios";

const initialState = {
    isLogin: false
}
type initialStateType = typeof initialState


export const authReducer = (state = initialState, action: AuthReducerActionType): initialStateType => {
    switch (action.type) {
        case 'AUTH/SET-IS-LOGIN': {
            return {...state, isLogin: action.value}
        }
        default: return state
    }
}
export type AuthReducerActionType = SetIsLoginACType | AppReducerType

export type SetIsLoginACType = ReturnType<typeof setIsLoginAC>
export const setIsLoginAC = (value: boolean) => {
    return {
        type: 'AUTH/SET-IS-LOGIN',
        value
    }as const
}

export const setIsLoginTC = (data: LoginParamsType) => (dispatch: Dispatch<AuthReducerActionType>) => {
    dispatch(appSetStatusAC('loading'))
    authAPI.login(data)
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
            appSetStatusAC('idle')
        })
}

export const logOutTC = () => (dispatch: Dispatch) => {
    //dispatch(appSetStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoginAC(false))
            } else {
                dispatch(appSetErrorAC(res.data.messages[0]))
            }
        })
        .catch((err: AxiosError) => {
            dispatch(appSetErrorAC(err.message))
        })
}