import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, Subject } from '../../services/admin.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SubjectFormComponent } from '../subject-form/subject-form.component';

// Angular Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-subjects',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './manage-subjects.component.html',
  styleUrls: ['./manage-subjects.component.scss']
})
export class ManageSubjectsComponent implements OnInit {
  subjects: Subject[] = [];
  isLoading = true;
  displayedColumns: string[] = ['name', 'description', 'actions'];

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.isLoading = true;
    this.adminService.getSubjects().subscribe({
      next: (data) => {
        this.subjects = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.snackBar.open('Failed to load subjects', 'Close', { duration: 3000 });
      }
    });
  }

  openSubjectDialog(subject?: Subject): void {
    const dialogRef = this.dialog.open(SubjectFormComponent, {
      width: '400px',
      data: { subject }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (subject) {
          this.adminService.updateSubject(subject._id, result).subscribe(() => {
            this.snackBar.open('Subject updated successfully!', 'Close', { duration: 3000 });
            this.loadSubjects();
          });
        } else {
          this.adminService.addSubject(result).subscribe(() => {
            this.snackBar.open('Subject added successfully!', 'Close', { duration: 3000 });
            this.loadSubjects();
          });
        }
      }
    });
  }

  deleteSubject(subject: Subject): void {
    if (confirm(`Are you sure you want to delete the subject "${subject.name}"?`)) {
      this.adminService.deleteSubject(subject._id).subscribe({
        next: () => {
          this.snackBar.open('Subject deleted successfully!', 'Close', { duration: 3000 });
          this.loadSubjects();
        },
        error: (err) => {
          this.snackBar.open(err.error.message || 'Failed to delete subject', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
