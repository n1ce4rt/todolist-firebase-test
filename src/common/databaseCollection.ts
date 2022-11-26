import { collection } from 'firebase/firestore';
import { db } from '../firebase-config';
export const tasksCollection = collection(db, 'tasks');