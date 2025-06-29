import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from './auth';
import { environment } from '../../environments/environment';

export interface Grade {
  _id: string;
  name: string;
  teachers: User[];
}

export interface Subject {
  _id: string;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        return new HttpHeaders().set('Authorization', `Bearer ${user.token}`);
      }
    }
    return new HttpHeaders();
  }

  // User Management
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() });
  }

  getUsersByRole(role: 'Student' | 'Teacher'): Observable<User[]> {
    return this.getUsers().pipe(
      map(users => users.filter(user => {
        const roleName = typeof user.role === 'object' ? user.role.name : user.role;
        return roleName === role;
      }))
    );
  }

  addUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/register`, userData, { headers: this.getAuthHeaders() });
  }

  updateUser(id: string, userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, userData, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { headers: this.getAuthHeaders() });
  }

  // Grade Management
  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/grades`, { headers: this.getAuthHeaders() });
  }

  addGrade(gradeData: { name: string }): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/grades`, gradeData, { headers: this.getAuthHeaders() });
  }

  updateGrade(id: string, gradeData: { name: string }): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/grades/${id}`, gradeData, { headers: this.getAuthHeaders() });
  }

  deleteGrade(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/grades/${id}`, { headers: this.getAuthHeaders() });
  }

  // Subject Management
  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/subjects`, { headers: this.getAuthHeaders() });
  }

  addSubject(subjectData: { name: string, description?: string }): Observable<Subject> {
    return this.http.post<Subject>(`${this.apiUrl}/subjects`, subjectData, { headers: this.getAuthHeaders() });
  }

  updateSubject(id: string, subjectData: { name: string, description?: string }): Observable<Subject> {
    return this.http.put<Subject>(`${this.apiUrl}/subjects/${id}`, subjectData, { headers: this.getAuthHeaders() });
  }

  deleteSubject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/subjects/${id}`, { headers: this.getAuthHeaders() });
  }

  // Assignments
  assignStudentToGrade(studentId: string, gradeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/assign-student-grade`, { studentId, gradeId }, { headers: this.getAuthHeaders() });
  }

  assignTeacherToGrade(teacherId: string, gradeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/assign-teacher-grade`, { teacherId, gradeId }, { headers: this.getAuthHeaders() });
  }
}
