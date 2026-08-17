import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  onSnapshot
} from '@angular/fire/firestore';
import { Observable, switchMap, of } from 'rxjs';
import { Project } from '../models/project.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  getProjects(): Observable<Project[]> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user) return of([]);

        return new Observable<Project[]>((subscriber) => {
          const projectsRef = collection(this.firestore, 'projects');
          const q = query(projectsRef, where('userId', '==', user.uid));

          const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
              const projects = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
              })) as Project[];
              subscriber.next(projects);
            },
            (error) => subscriber.error(error)
          );

          return () => unsubscribe();
        });
      })
    );
  }

  addProject(project: Omit<Project, 'id' | 'userId' | 'createdAt'>): Promise<unknown> {
    const user = this.authService.auth.currentUser;
    if (!user) throw new Error('Пользователь не авторизован');

    const projectsRef = collection(this.firestore, 'projects');
    return addDoc(projectsRef, {
      ...project,
      userId: user.uid,
      createdAt: new Date()
    });
  }

  updateProject(id: string, projectData: Partial<Project>): Promise<void> {
    const docRef = doc(this.firestore, `projects/${id}`);
    return updateDoc(docRef, projectData);
  }

  deleteProject(id: string): Promise<void> {
    const docRef = doc(this.firestore, `projects/${id}`);
    return deleteDoc(docRef);
  }
}