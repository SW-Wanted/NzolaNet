import { Component, inject, ChangeDetectorRef} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registo',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registo.component.html',
  styleUrl: './registo.component.css',
})
export class RegistoComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  formulario = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
  });

  submetido = false;
  emSubmissao = false;
  erroApi: string | null = null;

  registar(): void {
    this.submetido = true;
    this.erroApi = null;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { nome, email, senha } = this.formulario.getRawValue();
    this.emSubmissao = true;

    this.authService
      .register({
        name: nome,
        email,
        password: senha,
        password_confirmation: senha,
      })
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/feed');
        },
        error: (err: unknown) => {
          this.emSubmissao = false;
          if (err instanceof HttpErrorResponse && err.status === 422)
            this.erroApi = 'Email já está em uso. Por favor, escolha outro.';
          else
              this.erroApi = 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.';
          this.cdr.markForCheck();
        },
      });
  }
}
