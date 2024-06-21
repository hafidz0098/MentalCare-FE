// hooks/useAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/check");
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, loading };
};

export default useAuth;
