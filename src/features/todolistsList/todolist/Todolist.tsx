import React, {useEffect} from 'react'
import {AddItemForm} from 'components/addItemForm/AddItemForm'
import {EditableSpan} from 'components/editableSpan/EditableSpan'
import {Task} from './task/Task'
import {TaskStatuses} from 'api/todolists.api'
import {
    changeTodolistTitleTC,
    removeTodolistTC,
    todolistActions,
    TodolistDomainType
} from 'features/todolistsList/todolists.reducer'
import {addTaskTC, fetchTasksTC} from 'features/todolistsList/tasks.reducer'
import {useAppDispatch} from 'hooks/useAppDispatch';
import {Button, IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {useSelector} from "react-redux";
import {selectTasks} from "features/todolistsList/task.selector";

type TodolistPropsType = {
    todolist: TodolistDomainType
}

export const Todolist = ({todolist}: TodolistPropsType) => {

    const dispatch = useAppDispatch()
    const tasksAll = useSelector(selectTasks)

    useEffect(() => {
        dispatch(fetchTasksTC(todolist.id))
    }, [])

    let tasks = tasksAll[todolist.id]

    if (todolist.filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const addTask = (title: string) => {
        dispatch(addTaskTC(title, todolist.id))
    }

    const removeTodolist = () => {
        dispatch(removeTodolistTC(todolist.id))
    }
    const changeTodolistTitle = (title: string) => {
        dispatch(changeTodolistTitleTC(todolist.id, title))
    }

    const onAllClickHandler = () =>
        dispatch(todolistActions.changeTodolistFilter({filter: 'all', todolistId: todolist.id}))

    const onActiveClickHandler = () =>
        dispatch(todolistActions.changeTodolistFilter({filter: 'active', todolistId: todolist.id}))

    const onCompletedClickHandler = () =>
        dispatch(todolistActions.changeTodolistFilter({filter: 'completed', todolistId: todolist.id}))


    return <div>
        <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist} disabled={todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasks.map(t => <Task key={t.id} task={t} todolistId={todolist.id}
                />)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
}


