import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path:'dashboard',
                loadComponent: () => import("./features/dashboard/dashboard").then(m => m.Dashboard)
            },
            {
                path: 'employees',
                loadComponent: () => import("./features/employees/employee-list/employee-list").then(m => m.EmployeeList)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
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
    }
];
