
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
    
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/login/login')
                .then(m => m.Login)
    },

    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [

            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/dashboard/dashboard')
                        .then(m => m.Dashboard)
            },

            {
                path: 'employees',
                loadComponent: () =>
                    import('./features/employees/employee-list/employee-list')
                        .then(m => m.EmployeeList)
            },

            {
                path: 'employees/add',
                loadComponent: () =>
                    import('./features/employees/employee-form/employee-form')
                        .then(m => m.EmployeeForm)
            },

            {
                path: 'employees/edit/:id',
                loadComponent: () =>
                    import('./features/employees/employee-form/employee-form')
                        .then(m => m.EmployeeForm)
            },

            {
                path: 'employees/view/:id',
                loadComponent: () =>
                    import('./features/employees/employee-detail/employee-detail')
                        .then(m => m.EmployeeDetail)
            }

        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }

];
