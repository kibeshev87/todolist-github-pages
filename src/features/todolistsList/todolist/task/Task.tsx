import React, {ChangeEvent} from 'react'
import {Checkbox, IconButton} from '@mui/material'
import {EditableSpan} from 'components/editableSpan/EditableSpan'
import {Delete} from '@mui/icons-material'
import {TaskStatuses, TaskType} from 'api/todolists.api'
import {removeTaskTC, updateTaskTC} from "features/todolistsList/tasks.reducer";
import {useAppDispatch} from "hooks/useAppDispatch";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = ({task, todolistId}: TaskPropsType) => {

    const dispatch = useAppDispatch()

    const onClickHandler = () =>
        dispatch(removeTaskTC(task.id, todolistId))

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        let status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskTC(task.id, {status}, todolistId))
    }

    const onTitleChangeHandler = (newTitle: string) => {
        dispatch(updateTaskTC(task.id, {title: newTitle}, todolistId))
    }

    return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandler}>
            <Delete/>
        </IconButton>
    </div>
}
