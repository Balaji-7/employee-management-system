import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EmployeeService, EmployeePayload } from "../../../core/services/employee-service";

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm {
  employeeForm!: FormGroup;

  isEditMode = signal(false);
  employeeId!: number;
  submitting = signal(false);

  departments = [
    'Engineering',
    'Human Resources',
    'Finance',
    'Marketing',
    'Sales'
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9+\-\s()]{7,20}$/)
      ]],
      department: ['', Validators.required],
      title: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.employeeId = Number(id);
      this.loadEmployee();
    }
  }

  loadEmployee(): void {
    this.employeeService.getEmployeeById(this.employeeId)
      .subscribe({
        next: (employee) => {
          this.employeeForm.patchValue({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            department: employee.company.department,
            title: employee.company.title
          });
        },
        error: () => {
          alert('Unable to load employee details.');
          this.router.navigate(['/employees']);
        }
      });
  }
  submitForm(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const formValue = this.employeeForm.value;

    const employeeData: EmployeePayload = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      company: {
        department: formValue.department,
        title: formValue.title
      }
    };

    const request$ = this.isEditMode()
      ? this.employeeService.updateEmployee(this.employeeId, employeeData)
      : this.employeeService.addEmployee(employeeData);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.submitting.set(false);
        alert('Unable to save employee. Please try again.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
