import { AuthView } from '@neondatabase/neon-js/auth/react/ui';
import { useParams } from 'react-router-dom';

export function Auth() {
  const { pathname } = useParams();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <AuthView pathname={pathname} />
    </div>
  );
}
