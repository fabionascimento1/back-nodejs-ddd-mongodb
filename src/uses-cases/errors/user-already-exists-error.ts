export class UserDontExistsError extends Error {
  constructor() {
    super("Usuário não encontrado!");
  }
}
