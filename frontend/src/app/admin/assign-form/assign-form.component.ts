import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from '../../services/admin.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-assign-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './assign-form.component.html',
  styleUrls: ['./assign-form.component.scss']
})
export class AssignFormComponent implements OnInit {
  assignForm: FormGroup;
  title: string;
  items$!: Observable<any[]>; // Changed to any[] to satisfy the template compiler

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AssignFormComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: {
      assignType: 'studentToGrade' | 'teacherToGrade';
      itemId: string; // ID of the grade or user
      itemName: string; // Name of the grade or user
    }
  ) {
    this.title = `Assign ${data.assignType === 'studentToGrade' ? 'Grade' : 'Teacher'} to ${data.itemName}`;
    this.assignForm = this.fb.group({
      assignmentId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.assignType === 'studentToGrade') {
      this.items$ = this.adminService.getGrades();
    } else { // teacherToGrade
      this.items$ = this.adminService.getUsersByRole('Teacher');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.assignForm.valid) {
      this.dialogRef.close(this.assignForm.value.assignmentId);
    }
  }
}
