import React, { memo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { FilterBar } from '../filterBar/filterBar';
import { CreateTask } from '../createTask/createTask';
import { TasksList } from '../tasksList/tasksList';

export const Main = memo(() => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ height: '50vh', margin: '10px 0' }}> 
        <FilterBar />
        <CreateTask />
        <TasksList />
      </Box>
    </Container>
  );
});