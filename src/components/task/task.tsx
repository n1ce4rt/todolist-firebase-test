import React, {FC, useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import CreateIcon from '@mui/icons-material/Create';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';
import DownloadIcon from '@mui/icons-material/Download';
import { Link, TextField } from '@mui/material';
import { ref , uploadBytes } from 'firebase/storage';
import { DatePicker } from '../dataPiker/dataPiker';
import { fetchRemoveTask, fetchTaskFileUrl, fetchUpdateTaskStatus, fetchUpdateTaskTitle, TaskType } from '../../reducers/tasksSlice';
import { useAppDispatch } from '../../hooks/hooks';
import { storage } from '../../firebase-config';

type PropsType = {
  task: TaskType
};

export const Task: FC<PropsType> = ({task}) => {
  const {date, id, title, status, deadline, fileUrl} = task;

  useEffect(() => {
    dispatch(fetchTaskFileUrl(id));
  },[]);

  const dispatch = useAppDispatch();

  const [isEditable, setIsEditable] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState(title);

  const handleRemoveTask = () => {
    dispatch(fetchRemoveTask(id));
  };

  const handleChangeStatus = () => {
    dispatch(fetchUpdateTaskStatus({id, status}));
  };

  const toggleEditable = () => {
    setIsEditable(!isEditable);
  };

  const handleChangeNewTitle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTaskTitle(e.currentTarget.value);
  };

  const updateTaskTitle = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      if (newTaskTitle !== '' && newTaskTitle !== title) {
        dispatch(fetchUpdateTaskTitle({id, title: newTaskTitle}));
        setIsEditable(false);
      }
    };
  };
  
  const uploadTaskFile = async (e: any) => {
    if (e.target.files[0] === null) {
      return;
    }
    const fileRef = ref(storage, `files/${id}`);
    await uploadBytes(fileRef, e.target.files[0]);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    dispatch(fetchTaskFileUrl(id));
  };

  return (
    <Card sx={{ minWidth: 275, margin: '15px 0', display: 'flex', alignItems: 'center', flexDirection: 'column', bgcolor: task.status ? '#8AE9B3' : '#F1F2F6' }}>
      <CardContent sx={{width: '100%'}}>
        {
          isEditable ? 
            <TextField fullWidth value={newTaskTitle} onChange={handleChangeNewTitle} onKeyPress={updateTaskTitle} onBlur={() => setIsEditable(!isEditable)}/>
            :
            <Typography variant="h5" component="div" align="center"
              sx={{
                textDecoration: status? 'line-through' : '',
              }}>
              {title}
            </Typography>
        }
      </CardContent>
      <CardActions>

        <Stack direction="row" spacing={1}>
          <IconButton aria-label="done" color={status ? 'success': 'default'} onClick={handleChangeStatus}>
            <CheckIcon />
          </IconButton>
          <IconButton aria-label="rename" onClick={toggleEditable}>
            <CreateIcon />
          </IconButton>
          <IconButton aria-label="upload" component="label">
            <input hidden accept="image/*" multiple type="file" onChange={uploadTaskFile}/>
            <CloudUploadIcon />
          </IconButton>
          <Link href={fileUrl} underline="none" target={'_blank'} sx={{display: fileUrl === '' ? 'none' : 'block'}}>
            <IconButton aria-label="download" component="label">               
              <DownloadIcon />
            </IconButton>
          </Link>
          <IconButton aria-label="delete" onClick={handleRemoveTask}>
            <DeleteIcon/>
          </IconButton>
        </Stack>

        <DatePicker id={id} deadline={deadline} date={date}/>
      </CardActions>
    </Card>
  );
};