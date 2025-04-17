import { Navigate, useLocation } from "react-router-dom";
// HOOK
import useAuth from "app/hooks/useAuth";
import Loading from "app/components/MatxLoading";

export default function AuthGuard({ children }) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const { pathname } = useLocation();

  // Показываем лоадер пока идет инициализация или проверка аутентификации
  if (isLoading || !isInitialized) return <Loading />;

  if (isAuthenticated) return <>{children}</>;

  return <Navigate replace to="/session/signin" state={{ from: pathname }} />;
}
