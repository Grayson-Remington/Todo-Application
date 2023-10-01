import React, { useState } from 'react';
import axios from 'axios';
import { jwtSlice, setJwt } from '@/store';
import { useSelector, useDispatch } from 'react-redux';
import { setJwtToken, setUsernameCookie } from '../utils/jwtUtils';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
interface LoginFormProps {
	onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const dispatch = useDispatch();
	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// Replace 'YOUR_BACKEND_API_URL' with the actual API endpoint for login
			const loginEndpoint = `${process.env.NEXT_PUBLIC_DB_URL}/auth/login`;

			const data = {
				username: username,
				password: password,
			};

			// Send the login request using Axios
			const response = await axios.post(loginEndpoint, data);
			console.log(response);
			if (response.data.user !== null) {
				// Successful response
				toast.success('Login Successful!');
				dispatch(setJwt(response.data.jwt));
				setJwtToken(response.data.jwt, 7);
				setUsernameCookie(response.data.user.username, 7);
				onLoginSuccess();
			} else {
				// Unsuccessful response - throw an error to trigger the catch block
				throw new Error('Login request failed');
			}

			onLoginSuccess();
		} catch (error: any) {
			if (error.message == 'Login request failed') {
				toast.error('Wrong username & password. Please try again.');
			}
			console.log(error);
		}
	};

	return (
		<div className='h-full w-full'>
			<Toaster />
			<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2c2c38] p-8 rounded-lg'>
				<form
					onSubmit={handleFormSubmit}
					className='flex flex-col gap-1'
				>
					<label
						className='text-xl font-bold tracking-tight text-[#f0f1f7]'
						htmlFor='username'
					>
						Username:
					</label>
					<input
						type='text'
						id='username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						className='bg-[#999fac] rounded-lg  p-1 text-[#2c2c38]'
					/>

					<label
						className='text-xl font-bold tracking-tight text-[#f0f1f7]'
						htmlFor='password'
					>
						Password:
					</label>
					<input
						type='password'
						id='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className='bg-[#999fac] rounded-lg text-[#2c2c38] p-1'
					/>
					<br />
					<button
						className='text-3xl font-bold tracking-tight bg-[#3f9923] text-[#f0f1f7] rounded-lg p-1'
						type='submit'
					>
						Login
					</button>
					<button
						className='text-xl font-bold tracking-tight bg-[#5876b6] text-[#f0f1f7] rounded-lg mt-2'
						onClick={() => router.push('/register')}
					>
						Register
					</button>
				</form>
				<div className='text-xl font-bold tracking-tight text-[#f0f1f7]  mt-4'>
					<h1 className='underline text-center'>Guest Login</h1>
					<h2>Username: guest</h2>
					<h2>Password: Password123!</h2>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
