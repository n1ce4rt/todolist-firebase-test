import React, { FC, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { fetchUpdateTaskDeadline } from '../../reducers/tasksSlice';
import { useAppDispatch } from '../../hooks/hooks';

type PropsType = {
  id: string
  deadline: string
}
export const DatePicker: FC<PropsType> = ({id, deadline}) => {
  const deadlineTime = new Date(deadline);

  useEffect(()=> {
    
    const interval =  setInterval(() => {
      const currentTime = new Date(dayjs().format('YYYY-MM-DD'));
      currentTime > deadlineTime ? setIsExpired(true) : setIsExpired(false)
    }, 300000)

    return () => {
      clearInterval(interval)
    }
  },[deadline])

  const [isExpired, setIsExpired] = useState(false)
  const dispatch = useAppDispatch()
  const isDeadline = deadline ? dayjs(deadline) : dayjs();

  const [value, setValue] = React.useState<Dayjs | null>(isDeadline);


  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    // dispatch(setTaskDeadline({id, deadline: newValue?.format('YYYY-MM-DDTHH:mm:ss') as string}));
    dispatch(fetchUpdateTaskDeadline({id, deadline: newValue?.format('YYYY-MM-DD') as string}));
    
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
          label={deadline ? 'Deadline' : 'No end date'}
          inputFormat="DD/MM/YYYY"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} sx={{
            '.MuiInputBase-input': {color: isExpired ? 'red' : 'inherit'},
         }}/>}
        />
       

    </LocalizationProvider>
  );
};