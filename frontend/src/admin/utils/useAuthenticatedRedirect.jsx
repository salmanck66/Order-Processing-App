import { useEffect, useState } from "react";
import { verifyAdmin } from "../Api/getApi";
const useAuthenticatedRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await verifyAdmin(); 
        console.log("Verification response:", res);
        setIsTokenValid(true); 
      } catch (error) {
        console.error("Verification error:", error);
        setIsTokenValid(false);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  return { isTokenValid, loading };
};

export default useAuthenticatedRedirect;
