export interface EditResult {
  imageUrl: string | null;
  text: string | null;
}

// FIX: Add 'account' to the Mode type definition.
export type Mode = 'editor' | 'merger' | 'generator' | 'pricing' | 'privacy' | 'terms' | 'account';
