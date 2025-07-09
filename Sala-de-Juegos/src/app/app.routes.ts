import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
    // Si le ponemos 'prefix' nos va a arrojar un error en la consola de redireccion infinita
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'auth', loadChildren: () =>
        import('./auth/auth.module').then(m => m.AuthModule), 
    },
    { path: 'home', loadComponent: () =>
        import('./components/home/home.component').then(c => c.HomeComponent),
        canMatch: [authGuard] 
    },
    { path: 'about-me', loadComponent: () =>
        import('./components/about-me/about-me.component').then(c => c.AboutMeComponent), 
        canMatch: [authGuard] 

    },
    { path: 'games', loadChildren: () =>
        import('./games/games.module').then(m => m.GamesModule), 
        canMatch: [authGuard] 
    },
    { path: 'chat', loadComponent: () =>
        import('./components/chat/chat.component').then(m => m.ChatComponent), 
        canMatch: [authGuard] 
    },
    { path: 'scores', loadComponent: () =>
        import('./components/scores/scores.component').then(m => m.ScoresComponent), 
        canMatch: [authGuard] 
    },
    { path: 'encuestas', loadComponent: () =>
        import('./components/encuestas/encuestas.component').then(m => m.EncuestasComponent), 
        canMatch: [authGuard] 
    },
    // La ruta comodin debe ir siempre al final
    { path: '**', loadComponent: () =>
        import('./components/home/home.component').then(c => c.HomeComponent),
        canMatch: [authGuard]
    },
];