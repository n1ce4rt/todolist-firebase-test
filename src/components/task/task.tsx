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
import { DatePicker } from '../dataPiker/dataPiker';
import { fetchRemoveTask, fetchUpdateTaskStatus, fetchUpdateTaskTitle, setTaskFileUrl, TaskType } from '../../reducers/tasksSlice';
import { useAppDispatch } from '../../hooks/hooks';
import { TextField } from '@mui/material';
import { storage } from '../../firebase-config';
import { ref , uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
type PropsType = {
  task: TaskType
};
export const Task: FC<PropsType> = React.memo(({task}) => {

  useEffect(() => {
    const fetchTaskFileUrl = () => {
      const fileRef = ref(storage, `files`);
      listAll(fileRef).then((res) => {
        res.items.forEach((item) => {
          const fileId = item.fullPath.slice(6)
          getDownloadURL(item).then((url) => {
            if (fileId === id) {
              dispatch(setTaskFileUrl({id, url}))
            }
          })
        })
      })
    }
    fetchTaskFileUrl()
  },[])

  const dispatch = useAppDispatch();
  const {date, id, title, status, deadline, fileUrl} = task;
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
  const uploadTaskFile = (e: any) => {
    if (e.target.files[0] === null) {
      return;
    }
    const fileRef = ref(storage, `files/${id}`);
    console.log(fileRef)
    uploadBytes(fileRef, e.target.files[0])
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    
  };

  return (
    <Card sx={{ minWidth: 275, margin: '15px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#ffffff' }}>
      <CardContent>
        {
          isEditable ? 
          <TextField value={newTaskTitle} onChange={handleChangeNewTitle} onKeyPress={updateTaskTitle}/>
          :
          <Typography variant="h5" component="div" 
          sx={{
            textDecoration: status? 'line-through' : ''
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
          <a href={fileUrl} target={'_blank'}>
            <IconButton aria-label="download" component="label">
              <DownloadIcon />
            </IconButton>
          </a>
          <IconButton aria-label="delete" onClick={handleRemoveTask}>
            <DeleteIcon/>
          </IconButton>
        </Stack>

        <DatePicker id={id} deadline={deadline}/>
      </CardActions>
    </Card>
  )
})