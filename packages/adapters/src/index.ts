import type { AuthProvider } from '@vetted/ports';

export class InMemoryAuth implements AuthProvider {
  private currentUserId: string | null = null;

  async signIn(email: string, _password: string) {
    this.currentUserId = `user_${Buffer.from(email).toString('hex').slice(0, 8)}`;
    return { userId: this.currentUserId };
  }

  async signOut() {
    this.currentUserId = null;
  }

  async getSessionUserId() {
    return this.currentUserId;
  }
}


