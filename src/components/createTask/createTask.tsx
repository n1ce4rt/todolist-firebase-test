import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useAppDispatch } from '../../hooks/hooks';
import { fetchAddTask } from '../../reducers/tasksSlice';
import { utils } from '../../utils/utils';

export const CreateTask = () => {
  const disaptch = useAppDispatch()
  const [inputValue, setInputValue] = useState('')
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.currentTarget.value)
  }
  const onButtonClick = () => {
    const newTask: any = {
      title: inputValue,
      status: false,
      date: utils.getDate(),
      deadline: '',
      fileUrl: '',
    }
    disaptch(fetchAddTask(newTask))
    setInputValue('')
  }

  return (
    <Box component="form" sx={{display: 'flex', justifyContent: 'space-around', margin: '10px 0'}}>
      <TextField id="new-task" label="Task" variant="outlined" value={inputValue} onChange={onInputChange}/>
      <Button variant="contained" size="large" onClick={onButtonClick}>Add task</Button>
    </Box>
  )
}