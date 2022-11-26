import React from 'react';
import Box from '@mui/material/Box';
import { Task } from '../task/task';
import { useAppSelector } from '../../hooks/hooks';

export const TasksList = React.memo(() => {

  let tasks = useAppSelector(state => state.tasksSlice.tasks);

  const filter = useAppSelector(state => state.filterSlice.filter);

  if (filter === 'Done') {
    tasks = tasks.filter((task) => task.status);
  } 

  if (filter === 'Progress') {
    tasks = tasks.filter((task) => !task.status);
  }
  
  return (
    <Box>
      {
        tasks?.map((task) => {
          return (
            <Task 
              key={task.id}
              task={task}
            />
          );
        })
      }
    </Box>
  );
});