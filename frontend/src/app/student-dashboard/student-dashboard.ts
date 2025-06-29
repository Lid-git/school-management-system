import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../services/auth';
import { StudentService } from '../services/student.service';
import { Mark } from '../services/teacher.service';
import { Observable } from 'rxjs';

// Import Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.scss']
})
export class StudentDashboardComponent implements OnInit {
  profile$: Observable<User>;
  marks$: Observable<Mark[]>;
  isLoading = true;
  displayedColumns: string[] = ['subject', 'marks', 'teacher', 'updatedAt'];

  constructor(
    private authService: AuthService,
    private studentService: StudentService
  ) {
    this.profile$ = this.studentService.getMyProfile();
    this.marks$ = this.studentService.getMyMarks();
  }

  ngOnInit(): void {
    this.marks$.subscribe(() => this.isLoading = false);
  }

  logout(): void {
    this.authService.logout();
  }
}
