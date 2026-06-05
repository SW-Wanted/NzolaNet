import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CabecalhoComponent } from '../../components/cabecalho/cabecalho.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { mensagemErroHttp } from '../../utils/erro.utils';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=111827&color=ffffff&name=NzolaNet';

@Component({
  selector: 'app-editar-perfil',
  imports: [CabecalhoComponent, MenuLateralComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.css',
})
export class EditarPerfilComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly avatarPreview = signal<string>(DEFAULT_AVATAR);
  readonly erroApi = signal('');
  readonly emSubmissao = signal(false);

  formulario = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    descricaoCurta: ['Perfil NzolaNet'],
    biografia: ['', [Validators.maxLength(1000)]],
    privado: [false],
  });

  submetido = false;
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
  }

  aoSelecionarFoto(evento: Event): void {
    const ficheiro = (evento.target as HTMLInputElement).files?.[0];
    if (!ficheiro) return;

    if (!ficheiro.type.startsWith('image/')) {
      this.erroApi.set('Selecione um ficheiro de imagem válido (JPG, PNG ou GIF).');
      return;
    }

    if (ficheiro.size > 5 * 1024 * 1024) {
      this.erroApi.set('A foto não pode ter mais de 5 MB.');
      return;
    }

    this.fotoSelecionada = ficheiro;
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

    this.emSubmissao.set(true);
    const valores = this.formulario.getRawValue();

    const guardarPerfil = (): void => {
      this.userService
        .updateProfile({
          name: valores.nome,
          bio: valores.biografia,
          is_private: valores.privado,
        })
        .subscribe({
          next: () => {
            this.auth.getCurrentUserFromServer().subscribe({
              next: () => {
                this.emSubmissao.set(false);
                this.router.navigateByUrl('/perfil');
              },
              error: () => {
                this.emSubmissao.set(false);
                this.router.navigateByUrl('/perfil');
              },
            });
          },
          error: (err) => {
            this.erroApi.set(mensagemErroHttp(err));
            this.emSubmissao.set(false);
          },
        });
    };

    if (this.fotoSelecionada) {
      this.userService.uploadProfilePhoto(this.fotoSelecionada).subscribe({
        next: () => guardarPerfil(),
        error: (err) => {
          this.erroApi.set(mensagemErroHttp(err));
          this.emSubmissao.set(false);
        },
      });
    } else {
      guardarPerfil();
    }
  }
}
