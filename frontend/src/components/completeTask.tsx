import React from 'react';
import { getJwtToken } from '@/utils/jwtUtils';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
export async function completeTaskFunction(taskId: any) {
	const jwtToken = getJwtToken();
	const newCompletedValue = true;
	try {
		const response = await axios.put(
			`${process.env.NEXT_PUBLIC_DB_URL}/tasks/${taskId}/complete`,
			newCompletedValue,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
					'Content-Type': 'application/json',
				},
			}
		);
		toast.success('Task Completed!');
		return response.data;
	} catch (error) {
		toast.error('Error Completing task. Please try again.');
		throw error;
	}
}
