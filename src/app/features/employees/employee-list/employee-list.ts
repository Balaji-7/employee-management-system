
import { Component, OnInit, ViewChild, signal } from '@angular/core';

import {
  Employee,
  EmployeeService
} from '../../../core/services/employee-service';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router} from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList implements OnInit {

  displayedColumns: string[] = [
    'id',
    'employee',
    'email',
    'phone',
    'department',
    'actions'
  ];

  dataSource = new MatTableDataSource<Employee>([]);

  loading = signal(false);
  errorMessage = signal('');

  // Attach paginator whenever it becomes available
  @ViewChild(MatPaginator)
  set matPaginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  // Attach sorting whenever it becomes available
  @ViewChild(MatSort)
  set matSort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  constructor(private employeeService: EmployeeService,private router: Router) {

    this.dataSource.filterPredicate = (employee, filter) => {
      const searchText = `
        ${employee.id}
        ${employee.firstName}
        ${employee.lastName}
        ${employee.email}
        ${employee.phone}
        ${employee.company.department}
      `.toLowerCase();

      return searchText.includes(filter);
    };

    this.dataSource.sortingDataAccessor = (employee, property) => {
      switch (property) {
        case 'employee':
          return `${employee.firstName} ${employee.lastName}`.toLowerCase();

        case 'department':
          return employee.company.department.toLowerCase();

        default:
          return (employee as any)[property];
      }
    };
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.employeeService.getEmployees().subscribe({
      next: (employees:any) => {
        this.dataSource.data = employees;
        this.loading.set(false);
      },
      error: (error:Error) => {
        console.error('Employee API error:', error);
        this.errorMessage.set('Unable to load employees. Please try again.');
        this.loading.set(false);
      }
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }
  viewEmployee(id: number): void {
    this.router.navigate(['/employees/view', id]);
  }
  deleteEmployee(id: number): void {

  const confirmed = confirm('Are you sure you want to delete this employee?');

  if (!confirmed) {
    return;
  }

  this.employeeService.deleteEmployee(id).subscribe({
    next: () => {
      this.dataSource.data = this.dataSource.data.filter(
        employee => employee.id !== id
      );
    },
    error: (error) => {
      console.error('Delete employee error:', error);
      this.errorMessage.set('Unable to delete employee.');
    }
  });
}
}
