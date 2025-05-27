import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-beneficiario-upload',
  templateUrl: './beneficiario-upload.component.html',
  styleUrls: ['./beneficiario-upload.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class BeneficiarioUploadComponent implements OnInit {
  form: FormGroup;
  loading = false;
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BeneficiarioUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { beneficiario: any }
  ) {
    this.form = this.fb.group({
      documento_identidad: [null, [Validators.required]],
      sisben: [null, [Validators.required]],
      recibo_publico: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    // Initialize component
  }

  onFileSelected(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.form.get(controlName)?.setErrors({ invalidType: true });
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.form.get(controlName)?.setErrors({ maxSize: true });
        return;
      }

      this.form.get(controlName)?.setValue(file);
    }
  }

  getFileName(controlName: string): string {
    const file = this.form.get(controlName)?.value;
    return file ? file.name : 'Ningún archivo seleccionado';
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.uploadProgress = 0;

      // Simulate upload progress
      const interval = setInterval(() => {
        this.uploadProgress += 10;
        if (this.uploadProgress >= 100) {
          clearInterval(interval);
          this.loading = false;
          this.dialogRef.close(this.form.value);
        }
      }, 200);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
