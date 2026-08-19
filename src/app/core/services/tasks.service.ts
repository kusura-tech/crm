import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  onSnapshot,
  query,
  where
} from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { Task } from '../models/task.interface';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private tasksRef = collection(this.firestore, 'tasks');

  getTasks(): Observable<Task[]> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user) return of([] as Task[]);

        return new Observable<Task[]>((subscriber) => {
          const tasksQuery = query(this.tasksRef, where('userId', '==', user.uid));
          const unsubscribe = onSnapshot(
            tasksQuery,
            (snapshot) => {
              const tasks = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
              })) as Task[];
              subscriber.next(tasks);
            },
            (error) => subscriber.error(error)
          );

          return () => unsubscribe();
        });
      })
    );
  }

  addTask(task: Omit<Task, 'id' | 'userId' | 'createdAt'>) {
    const user = this.authService.auth.currentUser;
    if (!user) throw new Error('Пользователь не авторизован');

    return addDoc(this.tasksRef, {
      ...task,
      userId: user.uid,
      createdAt: new Date()
    });
  }

  updateTaskStatus(taskId: string, status: Task['status']) {
    const taskDoc = doc(this.firestore, `tasks/${taskId}`);
    return updateDoc(taskDoc, { status });
  }

  deleteTask(taskId: string) {
    const taskDoc = doc(this.firestore, `tasks/${taskId}`);
    return deleteDoc(taskDoc);
  }
}