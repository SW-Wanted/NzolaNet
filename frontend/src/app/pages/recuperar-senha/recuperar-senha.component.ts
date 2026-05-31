import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar-senha',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css',
})
export class RecuperarSenhaComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  formulario = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submetido = false;

  enviarLink(): void {
    this.submetido = true;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.router.navigateByUrl('/sucesso');
  }
}
