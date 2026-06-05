import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { mensagemErroHttp } from '../../utils/erro.utils';

@Component({
  selector: 'app-entrar',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './entrar.component.html',
  styleUrl: './entrar.component.css',
})
export class EntrarComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  formulario = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  submetido = false;
  emSubmissao = false;
  erroApi: string | null = null;

  entrar(): void {
    this.submetido = true;
    this.erroApi = null;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { email, senha } = this.formulario.getRawValue();
    this.emSubmissao = true;

    this.authService
      .login({ email, password: senha })
      .pipe(
        finalize(() => {
          this.emSubmissao = false;
        }),
      )
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/feed';
          void this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          this.erroApi = mensagemErroHttp(err);
        },
      });
  }
}
