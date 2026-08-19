import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  updateDoc,
  addDoc,
  onSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ContactMessage } from '../models/lead.interface';
import { ClientsService } from './client.service';

@Injectable({ providedIn: 'root' })
export class LeadsService {
  private firestore = inject(Firestore);
  private clientsService = inject(ClientsService);
  private leadsRef = collection(this.firestore, 'contactMessages');

  getLeads(): Observable<ContactMessage[]> {
    return new Observable<ContactMessage[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        this.leadsRef,
        (snapshot) => {
          const leads = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as ContactMessage[];
          subscriber.next(leads);
        },
        (error) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }

  addLead(lead: Omit<ContactMessage, 'id'>) {
    return addDoc(this.leadsRef, lead);
  }

  async convertToClient(lead: ContactMessage): Promise<void> {
    if (!lead.id) {
      throw new Error('Заявка не содержит идентификатор');
    }

    if (lead.status === 'converted') {
      throw new Error('Заявка уже преобразована в клиента');
    }

    try {
      const notes = [
        lead.body && `Сообщение: ${lead.body}`,
        lead.subject && `Услуга: ${lead.subject}`,
        lead.company != null && `Компаания: ${lead.company}`
      ]
        .filter(Boolean)
        .join('\n');

      await this.clientsService.addClient({
        name: lead.name,
        email: lead.email,
        notes: notes || undefined
      });

      const leadDoc = doc(this.firestore, `contactMessages/${lead.id}`);
      await updateDoc(leadDoc, { status: 'converted' });
    } catch (error) {
      console.error('Ошибка при конвертации заявки:', error);
      throw error;
    }
  }
}
