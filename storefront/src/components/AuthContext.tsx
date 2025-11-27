"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
	id: string;
	email: string;
	name: string;
	role: string;
	avatar?: string;
	phone?: string;
} | null;

type AuthContextType = {
	user: User;
	loading: boolean;
	refresh: () => void;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, refresh: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User>(null);
	const [loading, setLoading] = useState(true);

	const fetchUser = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/auth/me");
			const data = await res.json();
			setUser(data.user);
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return <AuthContext.Provider value={{ user, loading, refresh: fetchUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	return useContext(AuthContext);
}
