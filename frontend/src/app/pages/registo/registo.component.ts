import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registo',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registo.component.html',
  styleUrl: './registo.component.css',
})
export class RegistoComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  formulario = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  submetido = false;

  registar(): void {
    this.submetido = true;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.router.navigateByUrl('/sucesso');
  }
}
