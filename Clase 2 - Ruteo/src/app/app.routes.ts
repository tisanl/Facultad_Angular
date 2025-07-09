import { Routes } from '@angular/router';
import { AboutComponent } from './componentes/about/about.component';
import { HomeComponent } from './componentes/home/home.component';
import { PageNotFoundComponent } from './componentes/page-not-found/page-not-found.component';
import { ProductDetailComponent } from './componentes/product-detail/product-detail.component';
import { ProductsComponent } from './componentes/products/products.component';


export const routes: Routes = [
    // Si le ponemos 'prefix' nos va a arrojar un error en la consola de redireccion infinita
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    {
        path: 'products', component: ProductsComponent,
        children:
            [
                {
                    path: ":id",
                    component: ProductDetailComponent
                }
            ]
    },
    // La ruta comodin debe ir siempre al final
    { path: '**', component: PageNotFoundComponent },
    
];

