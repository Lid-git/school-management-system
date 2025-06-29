import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mark } from './teacher.service';
import { User } from './auth';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:5000/api/student';

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

  getMyProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }

  getMyMarks(): Observable<Mark[]> {
    return this.http.get<Mark[]>(`${this.apiUrl}/marks`, { headers: this.getAuthHeaders() });
  }
}
