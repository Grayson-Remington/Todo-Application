import React from 'react';
import { getJwtToken } from '@/utils/jwtUtils';
import axios from 'axios';
import toast from 'react-hot-toast';

export async function deleteCompletedTasksFunction(taskIds: any) {
	const jwtToken = getJwtToken();

	try {
		await axios.delete(
			`${process.env.NEXT_PUBLIC_DB_URL}/tasks/deleteSetOfTasks`,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
					'Content-Type': 'application/json',
				},
				params: {
					ids: taskIds.join(','),
				},
			}
		);
		toast.success('All Completed Tasks Deleted!');
	} catch (error) {
		toast.error('Error Deleting tasks. Please try again.');
	}
}
