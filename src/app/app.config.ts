import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideClientHydration(withEventReplay()),
  provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "kusura-technologies", appId: "1:585770053243:web:8bc480f7232121b6cafcde", storageBucket: "kusura-technologies.firebasestorage.app", apiKey: "AIzaSyAp5MNCtgL4jUMYI_ygFIt3GGmeaBLf5C8", authDomain: "kusura-technologies.firebaseapp.com", messagingSenderId: "585770053243", measurementId: "G-N2HLMJB9PV", projectNumber: "585770053243", version: "2" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),]
};
