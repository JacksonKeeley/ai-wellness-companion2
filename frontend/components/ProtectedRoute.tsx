"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);
  
    useEffect(() => {
      if (mounted && !user) {
        router.push("/login");
      }
    }, [mounted, user, router]);
  
    if (!mounted || !user) return null;
  
    return <>{children}</>;
  }
  