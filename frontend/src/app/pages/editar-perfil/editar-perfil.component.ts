import { Component, inject, signal } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=111827&color=ffffff&name=NzolaNet';

@Component({
  selector: 'app-editar-perfil',
  imports: [CabecalhoComponent, MenuLateralComponent, ReactiveFormsModule, RouterLink],
  imports: [CabecalhoComponent, MenuLateralComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css',
})
export class EditarPerfilComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly utilizador = this.dados.utilizadorActual();

  readonly avatarPreview = signal<string>(this.utilizador.avatar);

  readonly avatarPreview = signal<string>(this.utilizador.avatar);

  formulario = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    descricaoCurta: ['Perfil NzolaNet'],
    biografia: ['', [Validators.maxLength(1000)]],
    privado: [false],
  });

  submetido = false;

  aoSelecionarFoto(evento: Event): void {
    const ficheiro = (evento.target as HTMLInputElement).files?.[0];
    if (!ficheiro) return;
    const leitor = new FileReader();
    leitor.onload = () => this.avatarPreview.set(leitor.result as string);
    leitor.readAsDataURL(ficheiro);
  }

  aoSelecionarFoto(evento: Event): void {
    const ficheiro = (evento.target as HTMLInputElement).files?.[0];
    if (!ficheiro) return;
    const leitor = new FileReader();
    leitor.onload = () => this.avatarPreview.set(leitor.result as string);
    leitor.readAsDataURL(ficheiro);
  }

  guardar(): void {
    this.submetido = true;
    this.erroApi.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.emSubmissao = true;
    const valores = this.formulario.getRawValue();
    this.dados.utilizadorActual.update((utilizador) => ({
      ...utilizador,
      nome: valores.nome,
      descricao: valores.biografia,
      avatar: this.avatarPreview(),
      avatar: this.avatarPreview(),
    }));
    this.router.navigateByUrl('/perfil');
  }
}
