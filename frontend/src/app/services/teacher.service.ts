import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth';
import { Subject } from './admin.service';

export interface Mark {
    _id: string;
    student: User;
    subject: Subject;
    marks: number;
    teacher: User;
    createdAt: string;
    updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:5000/api/teacher';

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

  getAssignedStudents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/students`, { headers: this.getAuthHeaders() });
  }

  assignMark(studentId: string, subjectId: string, marks: number): Observable<Mark> {
    const body = { studentId, subjectId, marks };
    return this.http.post<Mark>(`${this.apiUrl}/marks`, body, { headers: this.getAuthHeaders() });
  }
}
