import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=111827&color=ffffff&name=NzolaNet';

@Component({
  selector: 'app-editar-perfil',
  imports: [CabecalhoComponent, MenuLateralComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css',
})
export class EditarPerfilComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly users = inject(UserService);

  formulario = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    descricaoCurta: ['Perfil NzolaNet'],
    biografia: ['', [Validators.maxLength(1000)]],
    privado: [false],
  });

  submetido = false;
  emSubmissao = false;
  erroApi = signal('');
  avatarPreview = signal(DEFAULT_AVATAR);
  private fotoSelecionada: File | undefined;

  ngOnInit(): void {
    const user = this.auth.currentUser();

    if (user) {
      this.formulario.patchValue({
        nome: user.name,
        biografia: user.bio ?? '',
        privado: user.is_private ?? false,
      });
      this.avatarPreview.set(user.profile_photo ?? DEFAULT_AVATAR);
    }

    this.auth.getCurrentUserFromServer().subscribe({
      next: (user) => {
        this.formulario.patchValue({
          nome: user.name,
          biografia: user.bio ?? '',
          privado: user.is_private ?? false,
        });
        this.avatarPreview.set(user.profile_photo ?? DEFAULT_AVATAR);
      },
    });
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

    this.users
      .updateProfile({
        name: valores.nome.trim(),
        bio: valores.biografia.trim() || null,
        is_private: valores.privado,
      })
      .subscribe({
        next: () => this.guardarFotoOuSair(),
        error: () => {
          this.erroApi.set('Nao foi possivel atualizar o perfil.');
          this.emSubmissao = false;
        },
      });
  }

  aoSelecionarFoto(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const ficheiro = input.files?.[0];

    if (!ficheiro) {
      return;
    }

    if (!ficheiro.type.startsWith('image/') || ficheiro.size > 4 * 1024 * 1024) {
      this.erroApi.set('Selecione uma imagem valida ate 4 MB.');
      input.value = '';
      return;
    }

    if (this.avatarPreview().startsWith('blob:')) {
      URL.revokeObjectURL(this.avatarPreview());
    }

    this.fotoSelecionada = ficheiro;
    this.avatarPreview.set(URL.createObjectURL(ficheiro));
  }

  private guardarFotoOuSair(): void {
    if (!this.fotoSelecionada) {
      this.finalizar();
      return;
    }

    this.users.uploadProfilePhoto(this.fotoSelecionada).subscribe({
      next: () => this.finalizar(),
      error: () => {
        this.erroApi.set('Perfil atualizado, mas nao foi possivel enviar a foto.');
        this.emSubmissao = false;
      },
    });
  }

  private finalizar(): void {
    this.auth.getCurrentUserFromServer().subscribe({
      next: () => void this.router.navigateByUrl('/perfil'),
      error: () => void this.router.navigateByUrl('/perfil'),
    });
  }
}
