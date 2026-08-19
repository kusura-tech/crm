import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  where
} from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { Payment } from '../models/payment.interface';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private paymentsRef = collection(this.firestore, 'payments');

  getPayments(): Observable<Payment[]> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user) return of([] as Payment[]);

        return new Observable<Payment[]>((subscriber) => {
          const paymentsQuery = query(this.paymentsRef, where('userId', '==', user.uid));
          const unsubscribe = onSnapshot(
            paymentsQuery,
            (snapshot) => {
              const payments = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data()
              })) as Payment[];
              subscriber.next(payments);
            },
            (error) => subscriber.error(error)
          );

          return () => unsubscribe();
        });
      })
    );
  }

  addPayment(payment: Omit<Payment, 'id' | 'userId' | 'createdAt'>): Promise<unknown> {
    const user = this.authService.auth.currentUser;
    if (!user) {
      throw new Error('Пользователь не авторизован');
    }

    return addDoc(this.paymentsRef, {
      ...payment,
      userId: user.uid,
      createdAt: new Date()
    });
  }
}
