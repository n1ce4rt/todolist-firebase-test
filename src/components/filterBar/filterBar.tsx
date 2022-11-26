import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { changeFilter } from '../../reducers/filterSlice';

export const FilterBar = () => {
  const dispatch = useAppDispatch();

  const filter = useAppSelector(state => state.filterSlice.filter);
  
  const handelFilterChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch(changeFilter(e.currentTarget.dataset.filter));
  };

  return (
    <Box sx={{display: 'flex', justifyContent: 'center'}}>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button color={filter === 'All' ? 'success': 'primary'} onClick={handelFilterChange} data-filter="All">All</Button>
        <Button color={filter === 'Progress' ? 'success': 'primary'} onClick={handelFilterChange} data-filter="Progress">Progress</Button>
        <Button color={filter === 'Done' ? 'success': 'primary'} onClick={handelFilterChange} data-filter="Done">Done</Button>
      </ButtonGroup>
    </Box>
  );
};