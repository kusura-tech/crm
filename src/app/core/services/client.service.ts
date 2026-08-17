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
import { Client } from '../models/client.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  // Получение списка клиентов в реальном времени через onSnapshot
  getClients(): Observable<Client[]> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user) return of([]);

        return new Observable<Client[]>((subscriber) => {
          const clientsRef = collection(this.firestore, 'clients');
          const q = query(clientsRef, where('userId', '==', user.uid));

          const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
              const clients = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
              })) as Client[];
              subscriber.next(clients);
            },
            (error) => subscriber.error(error)
          );

          return () => unsubscribe();
        });
      })
    );
  }

  // Создание клиента
  addClient(client: Omit<Client, 'id' | 'userId' | 'createdAt'>): Promise<unknown> {
    const user = this.authService.auth.currentUser;
    if (!user) throw new Error('Пользователь не авторизован');

    const clientsRef = collection(this.firestore, 'clients');
    return addDoc(clientsRef, {
      ...client,
      userId: user.uid,
      createdAt: new Date()
    });
  }

  // Обновление клиента
  updateClient(id: string, clientData: Partial<Client>): Promise<void> {
    const docRef = doc(this.firestore, `clients/${id}`);
    return updateDoc(docRef, clientData);
  }

  // Удаление клиента
  deleteClient(id: string): Promise<void> {
    const docRef = doc(this.firestore, `clients/${id}`);
    return deleteDoc(docRef);
  }
}