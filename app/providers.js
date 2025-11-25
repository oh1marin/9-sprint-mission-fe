'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <ProductProvider>
        {children}
      </ProductProvider>
    </AuthProvider>
  );
}