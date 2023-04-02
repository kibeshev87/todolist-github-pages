import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {addTodolistTC, fetchTodolistsTC} from 'features/todolistsList/todolists.reducer'
import {Grid, Paper} from '@mui/material'
import {AddItemForm} from 'components/addItemForm/AddItemForm'
import {Todolist} from './todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {useAppDispatch} from 'hooks/useAppDispatch';
import {selectIsLoggedIn} from "features/auth/auth.selector";
import {selectTodolists} from "features/todolistsList/todolist.selector";


export const TodolistsList = () => {

    const todolists = useSelector(selectTodolists)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [dispatch])

    const addTodolist = (title: string) => {
        dispatch(addTodolistTC(title))
    }

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>

                            <Todolist
                                todolist={tl}
                            />

                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
