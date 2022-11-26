import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase-config';
import { tasksCollection } from '../common/databaseCollection';
import { storage } from '../firebase-config';

export type TaskType = {
  id: string,
  title: string,
  status: boolean,
  isFile: boolean,
  fileUrl: string, 
  date: string,
  deadline: string,
};

export type InitialStateType = {
  tasks: TaskType[] 
};

const initialState: InitialStateType = {
  tasks: [],
};

type SetDeadlineType = {
  id: string,
  deadline: string,
};

export const fetchTaskFileUrl = createAsyncThunk<void, string, {rejectValue: string}>(
  'tasks/fetchTaskFileUrl',

  async function  (id, {dispatch})  {
    try {
      const fileRef = ref(storage, 'files');

      listAll(fileRef).then((res) => {
        res.items.forEach((item) => {
          const fileId = item.fullPath.slice(6);

          getDownloadURL(item).then((url) => {
            if (fileId === id) {
              dispatch(fetchUpdateTaskUrl({id, url}));
            }

          });
        });
      });
      
    } catch (error: any) {
      return error;
    };
  },
);

export const fetchUpdateTaskStatus = createAsyncThunk<null, {id: string, status: boolean}, {rejectValue: string}>(
  'tasks/fetchUpdateTaskStatus',

  async function  ({id, status}, {dispatch})  {
    try {
      const taskDoc = doc(db, 'tasks', id);

      await updateDoc(taskDoc, { status: !status});
      dispatch(fetchTasks());

    } catch (error: any) {
      return error;
    }
  },
);
export const fetchUpdateTaskUrl = createAsyncThunk<null, {id: string, url: string}, {rejectValue: string}>(
  'tasks/fetchUpdateTaskUrl',

  async function  ({id, url}, {dispatch})  {
    try {

      const taskDoc = doc(db, 'tasks', id);

      await updateDoc(taskDoc, {fileUrl: url});
      dispatch(fetchTasks());

    } catch (error: any) {
      return error;
    };
  },
);
export const fetchUpdateTaskTitle = createAsyncThunk<null, {id: string, title: string}, {rejectValue: string}>(
  'tasks/fetchUpdateTaskTitle',
  
  async function  ({id, title}, {dispatch})  {
    try {

      const taskDoc = doc(db, 'tasks', id);

      await updateDoc(taskDoc, { title: title });
      dispatch(fetchTasks());

    } catch (error: any) {
      return error;
    };
  },
);
export const fetchUpdateTaskDeadline = createAsyncThunk<null, {id: string, deadline: string}, {rejectValue: string}>(
  'tasks/fetchUpdateTaskDeadline',

  async function  ({id, deadline}, {dispatch})  {
    try {

      const taskDoc = doc(db, 'tasks', id);

      await updateDoc(taskDoc, {deadline: deadline});
      dispatch(fetchTasks());

    } catch (error: any) {
      return error;
    };
  },
);

export const fetchRemoveTask = createAsyncThunk<null, string, {rejectValue: string}>(
  'tasks/fetchRemoveTask',
  
  async function  (id, {dispatch})  {
    try {

      const taskDoc = doc(db, 'tasks', id);

      await deleteDoc(taskDoc);
      dispatch(fetchTasks());

    } catch (error: any) {
      return error;
    };
  },
);

export const fetchAddTask = createAsyncThunk<null, TaskType,{rejectValue: string}>(
  'tasks/fetchAddTask',

  async function  (task, {dispatch})  {
    try {

      await addDoc(tasksCollection, task);
      dispatch(fetchTasks());

    } catch (error: any) {
      return error;
    };
  },
);

export const fetchTasks = createAsyncThunk<TaskType[], void, {rejectValue: string}>(
  'tasks/fetchTasks',

  async function  ()  {
    try {

      const data = await getDocs(tasksCollection);
      const tasks = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
      return tasks;

    } catch (error: any) {
      return error;
    };
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<TaskType>) {
      state.tasks = [...state.tasks, action.payload];
    },
    removeTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    changeStatus(state, action) {
      state.tasks = state.tasks.map((task) => task.id === action.payload ? {...task, status: !task.status}: task);
    },
    setTaskFileUrl(state, action: PayloadAction<{id: string, url: string}>) {
      state.tasks = state.tasks?.map((task) => task.id === action.payload.id ? {...task, fileUrl: action.payload.url}: task);
    },
    setTaskDeadline(state, action: PayloadAction<SetDeadlineType>) {
      state.tasks = state.tasks?.map((task) => task.id === action.payload.id ? {...task, deadline: action.payload.deadline}: task);
    },
    setTaskFileStatus(state, action: PayloadAction<string>) {
      state.tasks = state.tasks?.map((task) => task.id === action.payload ? {...task, isFile: true}: task);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      });
  },
});

export const {addTask, removeTask, changeStatus, setTaskFileUrl, setTaskDeadline, setTaskFileStatus} = tasksSlice.actions;
export default tasksSlice.reducer;