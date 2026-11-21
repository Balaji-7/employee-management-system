import { Component,signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [ MatCardModule,
    MatIconModule,
    RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

    totalEmployees = signal(120);
  activeEmployees = signal(105);
  inactiveEmployees = signal(10);
  departments = signal(8);

  dashboardCards = [
    {
      title: 'Total Employees',
      icon: 'groups',
      value: this.totalEmployees
    },
    {
      title: 'Active Employees',
      icon: 'person',
      value: this.activeEmployees
    },
    {
      title: 'Inactive Employees',
      icon: 'person_off',
      value: this.inactiveEmployees
    },
    {
      title: 'Departments',
      icon: 'business',
      value: this.departments
    }
  ];
  
}
