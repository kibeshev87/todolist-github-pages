import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from 'features/todolistsList/TodolistsList'
import {ErrorSnackbar} from 'components/errorSnackbar/ErrorSnackbar'
import {useSelector} from 'react-redux'
import {initializeAppTC} from 'app/app.reducer'
import {Navigate, Route, Routes} from 'react-router-dom'
import {Login} from 'features/auth/Login'
import {logoutTC} from 'features/auth/auth.reducer'
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@mui/material';
import {Menu} from '@mui/icons-material'
import {selectIsLoggedIn} from "features/auth/auth.selector";
import {selectIsInitialized, selectStatus} from "app/app.selector";
import {useAppDispatch} from "hooks/useAppDispatch";


function App() {

    const dispatch = useAppDispatch()
    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    useEffect(() => {
        debugger
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {
        debugger
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    const logoutHandler = () => {
        debugger
        dispatch(logoutTC())
    }

    return (
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path='/' element={<TodolistsList/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='404' element={<h1 style={{textAlign: 'center'}}>404: Page not found</h1>}/>
                        <Route path='*' element={<Navigate to={'404'}/>}/>
                    </Routes>
                </Container>
            </div>
    )
}

export default App
