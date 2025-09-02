import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    // En mode local, on considère toujours l'utilisateur comme connecté
    initialData: {
      id: "local_admin_cbt",
      email: "admin@cbt.local",
      firstName: "Admin",
      lastName: "CBT",
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: true, // Toujours connecté en local
  };
}
