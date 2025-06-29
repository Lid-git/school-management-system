import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Grade } from '../../services/admin.service';
import { User } from '../../services/auth'; // Corrected User import
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GradeFormComponent } from '../grade-form/grade-form.component';
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
  selector: 'app-manage-grades',
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
    MatTooltipModule // Added for tooltips
  ],
  templateUrl: './manage-grades.component.html',
  styleUrls: ['./manage-grades.component.scss']
})
export class ManageGradesComponent implements OnInit {
  grades: Grade[] = [];
  isLoading = true;
  displayedColumns: string[] = ['name', 'teachers', 'actions'];

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {
    this.isLoading = true;
    this.adminService.getGrades().subscribe({
      next: (data) => {
        this.grades = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.snackBar.open('Failed to load grades', 'Close', { duration: 3000 });
      }
    });
  }

  getTeacherNames(teachers: User[]): string {
    if (!teachers || teachers.length === 0) {
      return 'None';
    }
    return teachers.map(t => t.name).join(', ');
  }

  openGradeDialog(grade?: Grade): void {
    const dialogRef = this.dialog.open(GradeFormComponent, {
      width: '300px',
      data: { grade }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (grade) {
          this.adminService.updateGrade(grade._id, result).subscribe(() => {
            this.snackBar.open('Grade updated successfully!', 'Close', { duration: 3000 });
            this.loadGrades();
          });
        } else {
          this.adminService.addGrade(result).subscribe(() => {
            this.snackBar.open('Grade added successfully!', 'Close', { duration: 3000 });
            this.loadGrades();
          });
        }
      }
    });
  }
  
  openAssignTeacherDialog(grade: Grade): void {
    const dialogRef = this.dialog.open(AssignFormComponent, {
      width: '400px',
      data: { 
        assignType: 'teacherToGrade',
        itemId: grade._id,
        itemName: grade.name
      }
    });

    dialogRef.afterClosed().subscribe(teacherId => {
      if (teacherId) {
        this.adminService.assignTeacherToGrade(teacherId, grade._id).subscribe({
          next: () => {
            this.snackBar.open('Teacher assigned successfully!', 'Close', { duration: 3000 });
            this.loadGrades();
          },
          error: (err) => this.snackBar.open(err.error.message || 'Failed to assign teacher', 'Close', { duration: 3000 })
        });
      }
    });
  }

  deleteGrade(grade: Grade): void {
    if (confirm(`Are you sure you want to delete the grade "${grade.name}"?`)) {
      this.adminService.deleteGrade(grade._id).subscribe({
        next: () => {
          this.snackBar.open('Grade deleted successfully!', 'Close', { duration: 3000 });
          this.loadGrades();
        },
        error: (err) => {
          this.snackBar.open(err.error.message || 'Failed to delete grade', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
