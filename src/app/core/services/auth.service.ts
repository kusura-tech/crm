import { Injectable, inject } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from, switchMap, of } from 'rxjs';
import { UserProfile } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private storage = inject(Storage);
  
  readonly currentUser$: Observable<User | null> = user(this.auth);

  // Получение полного профиля из Firestore
  readonly userProfile$: Observable<UserProfile | null> = this.currentUser$.pipe(
    switchMap(u => {
      if (!u) return of(null);
      const userDocRef = doc(this.firestore, `users/${u.uid}`);
      return docData(userDocRef) as Observable<UserProfile>;
    })
  );

  login(email: string, pass: string): Observable<unknown> {
    return from(signInWithEmailAndPassword(this.auth, email, pass));
  }

  register(email: string, pass: string, displayName: string): Observable<void> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, pass).then(async (cred) => {
        // 1. Обновляем имя в Firebase Auth
        await updateProfile(cred.user, { displayName });

        // 2. Сохраняем профиль пользователя в Firestore
        const userDocRef = doc(this.firestore, `users/${cred.user.uid}`);
        const newProfile: UserProfile = {
          uid: cred.user.uid,
          email,
          displayName,
          createdAt: new Date()
        };
        await setDoc(userDocRef, newProfile);
      })
    );
  }

  async updateUserProfile(displayName: string, photoURL?: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Пользователь не авторизован');

    await updateProfile(currentUser, {
      displayName: displayName.trim(),
      ...(photoURL ? { photoURL } : {})
    });
    await setDoc(doc(this.firestore, `users/${currentUser.uid}`), {
      uid: currentUser.uid,
      email: currentUser.email || '',
      displayName: displayName.trim(),
      ...(photoURL ? { photoURL } : {})
    }, { merge: true });
  }

  async uploadProfilePhoto(file: File): Promise<string> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('Пользователь не авторизован');

    const photoRef = ref(this.storage, `users/${currentUser.uid}/profile-photo`);
    await uploadBytes(photoRef, file, { contentType: file.type });
    const photoURL = await getDownloadURL(photoRef);
    await this.updateUserProfile(currentUser.displayName || '', photoURL);
    return photoURL;
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}