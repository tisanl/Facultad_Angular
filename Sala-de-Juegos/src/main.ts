import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

/*
Supabase
Organization: Organizacion Labo 4
Project Name: Labo 4
Contraseña: Labo4

La anon key y la url estan en Project Settings -> Data Api
*/