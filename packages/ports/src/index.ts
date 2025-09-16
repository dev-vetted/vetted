export interface AuthProvider {
  signIn(email: string, password: string): Promise<{ userId: string }>;
  signOut(): Promise<void>;
  getSessionUserId(): Promise<string | null>;
}

export interface PaymentProvider {
  createPaymentIntent(amountInCents: number, currency: string): Promise<{ id: string }>;
}

export interface RealtimeProvider {
  subscribe(channel: string, onMessage: (data: unknown) => void): () => void;
}


