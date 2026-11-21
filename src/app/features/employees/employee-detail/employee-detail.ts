import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Employee, EmployeeService } from '../../../core/services/employee-service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './employee-detail.html',
  styleUrl: './employee-detail.css'
})
export class EmployeeDetail implements OnInit {

  employee = signal<Employee | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.employeeService.getEmployeeById(id).subscribe({
      next: (response:any) => {
        this.employee.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/employees']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  editEmployee(): void {
    const id = this.employee()?.id;

    if (id) {
      this.router.navigate(['/employees/edit', id]);
    }
  }
}