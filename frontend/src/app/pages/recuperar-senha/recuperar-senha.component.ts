import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { mensagemErroHttp } from '../../utils/erro.utils';

@Component({
  selector: 'app-recuperar-senha',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css',
})
export class RecuperarSenhaComponent {
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly token = this.route.snapshot.queryParamMap.get('token') ?? '';
  readonly emailToken = this.route.snapshot.queryParamMap.get('email') ?? '';
  readonly modoReset = signal(Boolean(this.token && this.emailToken));

  formulario = this.formBuilder.nonNullable.group({
    email: [this.emailToken, [Validators.required, Validators.email]],
    senha: ['', [Validators.minLength(8)]],
    confirmarSenha: [''],
  });

  submetido = false;
  emSubmissao = false;
  mensagem = signal('');
  erroApi = signal('');

  enviarLink(): void {
    this.submetido = true;
    this.mensagem.set('');
    this.erroApi.set('');

    if (this.formulario.controls.email.invalid) {
      this.formulario.controls.email.markAsTouched();
      return;
    }

    if (this.modoReset()) {
      this.redefinirSenha();
      return;
    }

    this.emSubmissao = true;
    this.auth.forgotPassword(this.formulario.controls.email.value).subscribe({
      next: () => {
        this.mensagem.set('Link de recuperacao enviado. Verifique o email ou o log do backend em ambiente local.');
        this.emSubmissao = false;
      },
      error: (err) => {
        this.erroApi.set(mensagemErroHttp(err));
        this.emSubmissao = false;
      },
    });
  }

  private redefinirSenha(): void {
    const senha = this.formulario.controls.senha.value;
    const confirmarSenha = this.formulario.controls.confirmarSenha.value;

    if (senha.length < 8 || senha !== confirmarSenha) {
      this.erroApi.set('Informe uma senha com pelo menos 8 caracteres e confirme corretamente.');
      return;
    }

    this.emSubmissao = true;
    this.auth
      .resetPassword({
        token: this.token,
        email: this.formulario.controls.email.value,
        password: senha,
        password_confirmation: confirmarSenha,
      })
      .subscribe({
        next: () => void this.router.navigateByUrl('/entrar'),
        error: (err) => {
          this.erroApi.set(mensagemErroHttp(err));
          this.emSubmissao = false;
        },
      });
  }
}
