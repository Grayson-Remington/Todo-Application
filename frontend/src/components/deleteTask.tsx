import { getJwtToken } from '@/utils/jwtUtils';
import axios from 'axios';
import toast from 'react-hot-toast';

export async function deleteTaskFunction(id: any) {
	const jwtToken = getJwtToken();

	try {
		const response = await axios.delete(
			`${process.env.NEXT_PUBLIC_DB_URL}/tasks/${id}`,

			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			}
		);
		toast.success('Task Deleted!');
		return response.data;
	} catch (error) {
		toast.error('Error Deleting task. Please try again.');
		throw error;
	}
}
