import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../services/teacher.service';
import { User } from '../../services/auth';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MarkFormComponent } from '../mark-form/mark-form.component';

// Angular Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-students',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.scss']
})
export class ViewStudentsComponent implements OnInit {
  students: User[] = [];
  isLoading = true;
  displayedColumns: string[] = ['name', 'email', 'grade', 'actions'];

  constructor(
    private teacherService: TeacherService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.teacherService.getAssignedStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
      }
    });
  }

  openMarkForm(student: User): void {
    const dialogRef = this.dialog.open(MarkFormComponent, {
      width: '400px',
      data: { student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teacherService.assignMark(student._id, result.subjectId, result.marks).subscribe({
          next: () => {
            this.snackBar.open('Mark assigned successfully!', 'Close', { duration: 3000 });
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Failed to assign mark', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  getGradeName(grade: any): string {
    return grade ? grade.name : 'N/A';
  }
}
