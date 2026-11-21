import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  company: {
    name: string;
    department: string;
    title: string;
  },
  gender?: string;
  age?: number;
  address?: {
  address: string;
  city: string;
  state: string;
};
}

interface EmployeeApiResponse {
  users: Employee[];
  total: number;
  skip: number;
  limit: number;
}
export interface EmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: {
    department: string;
    title: string;
  };
}
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://dummyjson.com/users';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http
      .get<EmployeeApiResponse>(`${this.apiUrl}?limit=100`)
      .pipe(
        map(response => response.users)
      );
  }
  addEmployee(employee: EmployeePayload): Observable<Employee> {
    return this.http.post<Employee>(
      `${this.apiUrl}/add`,
      employee
    );
  }

  updateEmployee(id: number, employee: EmployeePayload): Observable<Employee> {
    return this.http.put<Employee>(
      `${this.apiUrl}/${id}`,
      employee
    );
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(
      `${this.apiUrl}/${id}`
    );
  }
  deleteEmployee(id: number): Observable<Employee> {
    return this.http.delete<Employee>(`${this.apiUrl}/${id}`);
  }
}
