import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AdminService, Subject } from '../../services/admin.service';
import { User } from '../../services/auth';
import { Observable } from 'rxjs';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-mark-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './mark-form.component.html',
  styleUrls: ['./mark-form.component.scss']
})
export class MarkFormComponent implements OnInit {
  markForm: FormGroup;
  subjects$!: Observable<Subject[]>;
  student: User;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MarkFormComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: { student: User }
  ) {
    this.student = data.student;
    this.markForm = this.fb.group({
      subjectId: ['', Validators.required],
      marks: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.subjects$ = this.adminService.getSubjects();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.markForm.valid) {
      this.dialogRef.close(this.markForm.value);
    }
  }
}
