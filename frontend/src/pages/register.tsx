import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';

interface RegisterFormProps {
	onRegisterSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const isPasswordValid = (password: any) => {
		// Check if the password has at least 8 characters
		if (password.length < 8) {
			return false;
		}

		// Check if the password contains a special character
		if (!/[\W_]/.test(password)) {
			return false;
		}

		// Check if the password contains a number
		if (!/\d/.test(password)) {
			return false;
		}

		// Check if the password contains an uppercase letter
		if (!/[A-Z]/.test(password)) {
			return false;
		}

		// Check if the password contains a lowercase letter
		if (!/[a-z]/.test(password)) {
			return false;
		}

		// If all conditions are satisfied, the password is valid
		return true;
	};
	const router = useRouter();
	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const registerEndpoint = `${process.env.NEXT_PUBLIC_DB_URL}/auth/register`;

			const data = {
				username: username,
				password: password,
			};

			await axios.post(registerEndpoint, data);
			toast.success('Registration Successful!');
			router.push('/');
		} catch (error: any) {
			console.log(error.response.data);
			if (error.response.data == 'User already exists.') {
				toast.error('Username taken. Please try again.');
			} else toast.error('Error Registering. Please try again.');
		}
	};

	return (
		<div className='h-full w-full'>
			<Toaster />
			<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2c2c38] p-8 rounded-lg'>
				<h1 className='text-3xl font-bold tracking-tight text-[#f0f1f7] text-center pb-6'>
					Register
				</h1>
				<form
					onSubmit={handleFormSubmit}
					className='flex flex-col gap-1 flex-wrap w-[200px]'
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
					{password && !isPasswordValid(password) && (
						<p className='text-red-500'>
							Password must have at least 8 characters, contain a
							special character, a number, and an uppercase and
							lowercase letter.
						</p>
					)}
					<br />
					<button
						className='text-xl font-bold tracking-tight bg-[#14a368] text-[#f0f1f7] rounded-lg'
						type='submit'
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};

export default RegisterForm;
