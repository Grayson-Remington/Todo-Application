import LoginForm from '../components/LoginForm';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getJwtToken } from '@/utils/jwtUtils';

export default function Home() {
	const router = useRouter();
	const jwtToken = getJwtToken();

	useEffect(() => {
		if (jwtToken) {
			router.push('/dashboard');
		}
	}, [jwtToken, router]);

	const handleLoginSuccess = () => {
		router.push('/dashboard');
	};
	return <LoginForm onLoginSuccess={handleLoginSuccess} />;
}
