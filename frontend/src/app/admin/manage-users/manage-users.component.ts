import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { User } from '../../services/auth';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { AssignFormComponent } from '../assign-form/assign-form.component';

// Angular Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  displayedColumns: string[] = ['name', 'email', 'role', 'grade', 'actions'];

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError(err, 'load users');
      }
    });
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        if (user && user._id) {
          this.adminService.updateUser(user._id, result).subscribe({
            next: () => this.handleSuccess('User updated successfully!'),
            error: (err) => this.handleError(err, 'update user')
          });
        } else {
          this.adminService.addUser(result).subscribe({
            next: () => this.handleSuccess('User added successfully!'),
            error: (err) => this.handleError(err, 'add user')
          });
        }
      }
    });
  }
  
  openAssignGradeDialog(user: User): void {
    if (this.getRoleName(user.role) !== 'Student') {
      this.snackBar.open('Can only assign grades to students.', 'Close', { duration: 3000 });
      return;
    }
    const dialogRef = this.dialog.open(AssignFormComponent, {
      width: '400px',
      data: { 
        assignType: 'studentToGrade',
        itemId: user._id,
        itemName: user.name
      }
    });

    dialogRef.afterClosed().subscribe(gradeId => {
      if (gradeId) {
        this.adminService.assignStudentToGrade(user._id, gradeId).subscribe({
          next: () => {
            this.handleSuccess('Grade assigned successfully!');
          },
          error: (err) => this.handleError(err, 'assign grade')
        });
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete the user "${user.name}"?`)) {
      this.isLoading = true;
      this.adminService.deleteUser(user._id).subscribe({
        next: () => this.handleSuccess('User deleted successfully!'),
        error: (err) => this.handleError(err, 'delete user')
      });
    }
  }

  getRoleName(role: any): string {
    return typeof role === 'object' && role !== null ? role.name : role;
  }
  
  getGradeName(grade: any): string {
    return typeof grade === 'object' && grade !== null ? grade.name : 'N/A';
  }
  
  private handleSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.loadUsers();
  }

  private handleError(err: any, action: string): void {
    this.isLoading = false;
    this.snackBar.open(err.error?.message || `Failed to ${action}`, 'Close', { duration: 5000 });
  }
}
