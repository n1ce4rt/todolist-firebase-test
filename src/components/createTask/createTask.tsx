import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchAddTask, TaskType } from '../../reducers/tasksSlice';
import { utils } from '../../utils/utils';
import { TaskSnackbar } from '../snackbar/snackbar';

export const CreateTask = () => {
  const disaptch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const [hasAlready, setHasAlready] = useState(false);
  const tasks = useAppSelector(state => state.tasksSlice.tasks);
  const comparison = (task: TaskType) => (task.title === inputValue);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHasAlready(false);
    setInputValue(e.currentTarget.value);
  };

  const onButtonClick = () => {
    if (tasks.some(comparison)) {
      setHasAlready(true);
      return;
    }

    const newTask: any = {
      title: inputValue,
      status: false,
      date: utils.getDate(),
      deadline: '',
      fileUrl: '',
      isFile: false,
    };
    
    disaptch(fetchAddTask(newTask));
    setInputValue('');
  };

  return (
    <Box component="form" sx={{display: 'flex', justifyContent: 'space-around', margin: '10px 0'}}>
      <TaskSnackbar hasAlready={hasAlready} setHasAlready={setHasAlready}/>
      <TextField sx={{width: '78%'}} id="new-task" label="Task" variant="outlined" value={inputValue} onChange={onInputChange}/>
      <Button variant="contained" size="large" onClick={onButtonClick} disabled={!inputValue}>Add task</Button>
    </Box>
  );
};