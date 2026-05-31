import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-entrar',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './entrar.component.html',
  styleUrl: './entrar.component.css',
})
export class EntrarComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  formulario = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  submetido = false;

  entrar(): void {
    this.submetido = true;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.router.navigateByUrl('/feed');
  }
}
