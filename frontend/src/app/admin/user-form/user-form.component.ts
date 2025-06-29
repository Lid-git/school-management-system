import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../services/auth';

@Component({
  selector: 'app-user-form',
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
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean;
  roles: string[] = ['Student', 'Teacher', 'Admin'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) {
    this.isEditMode = !!data.user;

    // Correctly get the role name whether it's an object or a string
    const roleName = (data.user?.role && typeof data.user.role === 'object') 
      ? data.user.role.name 
      : data.user?.role || '';

    this.userForm = this.fb.group({
      name: [data.user?.name || '', Validators.required],
      email: [data.user?.email || '', [Validators.required, Validators.email]],
      password: [''],
      roleName: [roleName, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      // Password is not required when editing
      this.userForm.get('password')?.clearValidators();
    } else {
      // Password is required for new users
      this.userForm.get('password')?.setValidators(Validators.required);
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      // Do not send an empty password field
      if (!formData.password) {
        delete formData.password;
      }
      this.dialogRef.close(formData);
    }
  }
}
