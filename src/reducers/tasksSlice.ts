import { createSlice, PayloadAction, createAsyncThunk, } from '@reduxjs/toolkit'
import { getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase-config'
import { tasksCollection } from '../common/databaseCollection'
export type TaskType = {
  id: string,
  title: string,
  status: boolean,
  fileUrl: string, 
  date: string,
  deadline: string,
}
export type InitialStateType = {
  tasks: TaskType[] 
}
const initialState: InitialStateType = {
  tasks: []
}
type SetDeadlineType = {
  id: string,
  deadline: string,
}
export const fetchUpdateTaskStatus = createAsyncThunk<null, {id: string, status: boolean}, {rejectValue: string}>(
  'tasks/fetchUpdateTaskStatus',
  async function  ({id, status}, {dispatch})  {
    try {
      const taskDoc = doc(db, 'tasks', id)
      await updateDoc(taskDoc, { status: !status})
      dispatch(fetchTasks())
    } catch (error: any) {
      return error;
    }
  },
);
export const fetchUpdateTaskTitle = createAsyncThunk<null, {id: string, title: string}, {rejectValue: string}>(
  'tasks/fetchUpdateTaskTitle',
  async function  ({id, title}, {dispatch})  {
    try {
      const taskDoc = doc(db, 'tasks', id)
      await updateDoc(taskDoc, { title: title})
      dispatch(fetchTasks())
    } catch (error: any) {
      return error;
    }
  },
);
export const fetchUpdateTaskDeadline = createAsyncThunk<null, {id: string, deadline: string}, {rejectValue: string}>(
  'tasks/fetchUpdateTaskDeadline',
  async function  ({id, deadline}, {dispatch})  {
    try {
      const taskDoc = doc(db, 'tasks', id)
      await updateDoc(taskDoc, {deadline: deadline})
      dispatch(fetchTasks())
    } catch (error: any) {
      return error;
    }
  },
);

export const fetchRemoveTask = createAsyncThunk<null, string, {rejectValue: string}>(
  'tasks/fetchRemoveTask',
  async function  (id, {dispatch})  {
    try {
      debugger
      const taskDoc = doc(db, 'tasks', id)
      await deleteDoc(taskDoc)
      dispatch(fetchTasks())
    } catch (error: any) {
      return error;
    }
  },
);

export const fetchAddTask = createAsyncThunk<null, TaskType,{rejectValue: string}>(
  'tasks/fetchAddTask',
  async function  (task, {dispatch})  {
    try {
     await addDoc(tasksCollection, task)
     dispatch(fetchTasks())
    } catch (error: any) {
      return error;
    }
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
    }
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<TaskType>) {
      state.tasks = [...state.tasks, action.payload]
    },
    removeTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
    },
    changeStatus(state, action) {
      state.tasks = state.tasks.map((task) => task.id === action.payload ? {...task, status: !task.status}: task)
    },
    setTaskFileUrl(state, action: PayloadAction<{id: string, url: string}>) {
      state.tasks = state.tasks?.map((task) => task.id === action.payload.id ? {...task, fileUrl: action.payload.url}: task)
    },
    setTaskDeadline(state, action: PayloadAction<SetDeadlineType>) {
      state.tasks = state.tasks?.map((task) => task.id === action.payload.id ? {...task, deadline: action.payload.deadline}: task)
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchTasks.pending, (state) => {
    })
    .addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload
    })
    .addCase(fetchTasks.rejected, (state, acttion) => {
    })
    .addCase(fetchAddTask.fulfilled, (state, action) => {
      
    })
    
  }
})

export const {addTask, removeTask, changeStatus, setTaskFileUrl, setTaskDeadline} = tasksSlice.actions;
export default tasksSlice.reducer;