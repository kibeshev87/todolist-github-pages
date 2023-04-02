import React, {useCallback, useEffect} from 'react'
import './App.css'
import {TodolistsList} from 'features/todolistsList/TodolistsList'
import {ErrorSnackbar} from 'components/errorSnackbar/ErrorSnackbar'
import {useDispatch, useSelector} from 'react-redux'
import {initializeAppTC} from 'app/app.reducer'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
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


function App() {
    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const dispatch = useDispatch<any>()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const logoutHandler = useCallback(() => {
        dispatch(logoutTC())
    }, [dispatch])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <BrowserRouter>
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
                        <Route path={'/'} element={<TodolistsList/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                    </Routes>
                </Container>
            </div>
        </BrowserRouter>
    )
}

export default App
