import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { ManageGradesComponent } from './admin/manage-grades/manage-grades.component';
import { ManageSubjectsComponent } from './admin/manage-subjects/manage-subjects.component';
import { ViewStudentsComponent } from './teacher/view-students/view-students.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'Admin' },
    children: [
      { path: 'users', component: ManageUsersComponent },
      { path: 'grades', component: ManageGradesComponent },
      { path: 'subjects', component: ManageSubjectsComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { 
    path: 'teacher', 
    component: TeacherDashboardComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'Teacher' },
    children: [
      { path: 'students', component: ViewStudentsComponent },
      { path: '', redirectTo: 'students', pathMatch: 'full' }
    ]
  },
  { 
    path: 'student', 
    component: StudentDashboardComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'Student' }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
