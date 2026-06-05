import { HttpErrorResponse } from '@angular/common/http';

export function mensagemErroHttp(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'Não foi possível ligar ao servidor. Verifique se o servidor está a funcionar e tente novamente.';
    }
    if (error.status === 401) {
      return 'Sessão expirada. Por favor, faça login novamente.';
    }
    if (error.status === 403) {
      return 'Não tem permissão para realizar esta acção.';
    }
    if (error.status === 404) {
      return 'O recurso solicitado não foi encontrado.';
    }
    if (error.status === 422) {
      const mensagens = error.error?.errors;
      if (mensagens) {
        return Object.values(mensagens).flat().join(' ');
      }
      return 'Dados inválidos. Verifique os campos e tente novamente.';
    }
    if (error.status >= 500) {
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    }
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
}
