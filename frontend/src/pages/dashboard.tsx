import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { parse } from 'cookie';
import {
	getJwtToken,
	removeJwtToken,
	removeUsernameCookie,
} from '@/utils/jwtUtils';
import { deleteTaskFunction } from '../components/deleteTask';
import { completeTaskFunction } from '../components/completeTask';
import { deleteCompletedTasksFunction } from '../components/deleteAllCompleted';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';

export async function getServerSideProps(context: any) {
	const cookies = parse(context.req.headers.cookie || '');
	const username = cookies.username || '';

	return {
		props: {
			username,
		},
	};
}
const DashboardPage: React.FC = ({ username }: any) => {
	const [showSaveTask, setShowSaveTask] = useState(false);
	const jwtToken = getJwtToken();

	const router = useRouter();
	const handleOpenSaveTask = () => {
		setShowSaveTask(true);
	};

	const handleCloseSaveTask = () => {
		setShowSaveTask(false);
	};

	const signoutFunction = () => {
		removeJwtToken();
		removeUsernameCookie();
		router.push('/');
	};

	useEffect(() => {
		if (!jwtToken) {
			router.push('/');
		}
	}, [jwtToken, router]);

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05,
			},
		},
	};

	const lowerContainer = {
		hidden: { opacity: 0 },
		show: { opacity: 1 },
	};

	const [completed, setCompleted] = useState<any[]>([]);
	const [notCompleted, setnotCompleted] = useState<any[]>([]);
	const [taskTitle, setTaskTitle] = useState('');
	const [taskDescription, setTaskDescription] = useState('');
	const [isHidden, setIsHidden] = useState(false);

	const moveCompletedTask = (taskId: any) => {
		const taskIndex = notCompleted.findIndex(
			(task) => task.taskId === taskId
		);
		if (taskIndex !== -1) {
			const taskToMove = notCompleted.splice(taskIndex, 1)[0];
			setCompleted((completed) => [...completed, taskToMove]);
		}
	};
	const deleteNotCompletedTask = (taskId: any) => {
		const taskIndex = notCompleted.findIndex(
			(task) => task.taskId === taskId
		);
		if (taskIndex !== -1) {
			const newArr = notCompleted
				.slice(0, taskIndex)
				.concat(notCompleted.slice(taskIndex + 1));
			setnotCompleted(newArr);
		}
	};
	const deleteCompletedTask = (taskId: any) => {
		const taskIndex = completed.findIndex((task) => task.taskId === taskId);
		if (taskIndex !== -1) {
			const newArr = completed
				.slice(0, taskIndex)
				.concat(completed.slice(taskIndex + 1));
			setCompleted(newArr);
		}
	};

	useEffect(() => {
		axios
			.get(`${process.env.NEXT_PUBLIC_DB_URL}/tasks/list/${username}`, {
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
			})
			.then((response) => {
				setCompleted(
					response.data.filter((task: any) => task.completed === true)
				);

				setnotCompleted(
					response.data.filter(
						(task: any) => task.completed === false
					)
				);
			})

			.catch((error) => {});
	}, []);

	const saveTaskFunction = async (data: any) => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_DB_URL}/tasks/saveTask`,

				data,
				{
					headers: {
						Authorization: `Bearer ${jwtToken}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			// Handle error appropriately (e.g., show error message, log, etc.)
			throw error;
		}
	};

	useEffect(() => {}, [notCompleted]);
	const handleFormSubmit = async (event: any) => {
		event.preventDefault();
		try {
			const dataToSend = {
				taskTitle: taskTitle,
				taskAuthor: username,
				taskDescription: taskDescription,
				completed: false,
			};

			const response = await saveTaskFunction(dataToSend);

			toast.success('Task saved successfully!');
			setTaskTitle('');
			setTaskDescription('');
			setnotCompleted((prevNotCompleted) => [
				...prevNotCompleted,
				response,
			]);
			handleCloseSaveTask();
		} catch (error) {
			toast.error('Error saving task. Please try again.');
		}
	};

	return (
		<div className='p-6 md:p-12 bg-[#21212d] h-screen flex flex-col gap-4'>
			<Toaster />
			<div className='flex flex-col justify-between sm:flex-row'>
				<h1 className='text-3xl font-bold tracking-tight text-[#f0f1f7] text-center'>
					Welcome, {username}
				</h1>

				<button
					onClick={signoutFunction}
					className='text-3xl font-bold tracking-tight text-[#f0f1f7] text-center'
				>
					Sign Out
				</button>
			</div>

			{showSaveTask && (
				<div className='z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2c2c38] p-8 border-white border rounded-lg'>
					<button
						className='text-1xl font-bold tracking-tight text-[#f0f1f7] absolute right-2 top-2'
						onClick={handleCloseSaveTask}
					>
						Close
					</button>
					<form
						action=''
						onSubmit={handleFormSubmit}
						className='flex flex-col gap-2'
					>
						<h1 className='text-xl font-bold tracking-tight text-[#f0f1f7]'>
							Title:
						</h1>
						<input
							required
							type='text'
							name='key1'
							value={taskTitle}
							onChange={(e) => {
								setTaskTitle(e.target.value);
							}}
							placeholder='Enter value for Title'
							className='bg-[#999fac] rounded-lg  p-1 text-[#2c2c38]'
						/>
						<h1 className='text-xl font-bold tracking-tight text-[#f0f1f7]'>
							Description:
						</h1>
						<input
							required
							type='text'
							name='key1'
							value={taskDescription}
							onChange={(e) => setTaskDescription(e.target.value)}
							placeholder='Enter value for Description'
							className='bg-[#999fac] rounded-lg text-[#2c2c38] p-1'
						/>

						<button
							type='submit'
							className='text-xl font-bold tracking-tight bg-[#5876b6] text-[#f0f1f7] rounded-lg mt-2'
						>
							Submit
						</button>
					</form>
				</div>
			)}
			<div className='flex md:hidden gap-4 overflow-y-hidden relative justify-center'>
				<div className='absolute left-0 top-10'>
					<input
						className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
						type='checkbox'
						role='switch'
						id='flexSwitchCheckDefault'
						onChange={() => {
							setIsHidden(!isHidden);
						}}
					/>
				</div>

				<motion.div
					className='flex-col overflow-y-hidden overflow-x-hidden w-3/4'
					initial={{ opacity: 1 }}
					animate={{ opacity: isHidden ? 0 : 1 }}
					style={{ display: isHidden ? 'none' : 'flex' }}
				>
					<div className='flex flex-col p-4 place-items-center'>
						<h1 className='text-3xl font-bold tracking-tight text-[#f0f1f7] text-center p-4'>
							To do
						</h1>
						<button
							className='text-3xl font-bold tracking-tight text-[#f0f1f7] bg-[#2c2c38] p-2 border rounded-lg border-transparent'
							onClick={handleOpenSaveTask}
						>
							Add Task
						</button>
					</div>
					<div className='overflow-y-auto'>
						<motion.ul
							className='flex flex-col gap-2 overflow-y-auto px-4'
							variants={container}
							initial='hidden'
							animate='show'
						>
							{notCompleted.map((item) => (
								<motion.li
									className='border rounded-lg p-4 bg-[#2c2c38] border-transparent flex flex-col sm:flex-row gap-4'
									variants={lowerContainer}
									key={item.taskId}
								>
									<div className='flex flex-col flex-1 overflow-hidden break-words'>
										<h4 className='text-xl font-bold tracking-tight text-[#f0f1f7]'>
											{' '}
											{item.taskTitle}
										</h4>
										<h1 className='text-[#999fac] flex-1 overflow-hidden break-words'>
											{item.taskDescription}
										</h1>
									</div>

									<div className='flex  gap-2 place-items-center align-middle justify-center'>
										<button
											className=' text-[#f0f1f7] bg-green-800 rounded-lg p-4'
											onClick={() => {
												completeTaskFunction(
													item.taskId
												);
												moveCompletedTask(item.taskId);
											}}
										>
											Complete
										</button>
										<button
											className='text-[#f0f1f7] bg-red-800 rounded-lg p-4'
											onClick={() => {
												deleteTaskFunction(item.taskId);
												deleteNotCompletedTask(
													item.taskId
												);
											}}
										>
											Delete
										</button>
									</div>
								</motion.li>
							))}
						</motion.ul>
					</div>
				</motion.div>
				<motion.div
					className='overflow-y-hidden overflow-x-hidden flex-col w-3/4'
					initial={{ opacity: 1 }}
					animate={{ opacity: !isHidden ? 0 : 1 }}
					style={{ display: !isHidden ? 'none' : 'flex' }}
				>
					<div className='flex flex-col p-4 place-items-center'>
						<h1 className='text-3xl font-bold tracking-tight text-[#f0f1f7] text-center p-4'>
							Completed
						</h1>

						<button
							className='text-3xl font-bold tracking-tight text-[#f0f1f7] bg-[#2c2c38] p-2 border rounded-lg border-transparent'
							onClick={() => {
								const arrayOfCompletedIds = completed.map(
									(obj) => obj.taskId
								);
								deleteCompletedTasksFunction(
									arrayOfCompletedIds
								);
								setCompleted([]);
							}}
						>
							Clear All
						</button>
					</div>
					<motion.ul
						className='flex flex-col gap-2 overflow-y-auto px-4'
						variants={container}
						initial='hidden'
						animate='show'
					>
						{completed.map((item) => (
							<motion.li
								className='border rounded-lg p-4 bg-[#2c2c38] border-transparent flex gap-4'
								variants={lowerContainer}
								key={item.taskId}
							>
								<div className='flex flex-col flex-1 overflow-hidden break-words'>
									<h4 className='text-xl font-bold tracking-tight text-[#f0f1f7]'>
										{' '}
										{item.taskTitle}
									</h4>
									<h1 className='text-[#999fac] flex-1 overflow-hidden break-words'>
										{item.taskDescription}
									</h1>
								</div>

								<div className='flex gap-2 place-items-center'>
									<button
										className='text-[#f0f1f7] bg-red-800 rounded-lg p-4'
										onClick={() => {
											deleteTaskFunction(item.taskId);
											deleteCompletedTask(item.taskId);
										}}
									>
										Delete
									</button>
								</div>
							</motion.li>
						))}
					</motion.ul>
				</motion.div>
			</div>
			<div className='hidden md:grid md:grid-cols-2 gap-4 overflow-y-hidden'>
				<motion.div className='flex flex-col overflow-y-hidden'>
					<div className='flex flex-col p-4 place-items-center'>
						<h1 className='text-3xl font-bold tracking-tight text-[#f0f1f7] text-center p-4'>
							To do
						</h1>
						<button
							className='text-3xl font-bold tracking-tight text-[#f0f1f7] bg-[#2c2c38] p-2 border rounded-lg border-transparent'
							onClick={handleOpenSaveTask}
						>
							Add Task
						</button>
					</div>
					<div className='overflow-y-auto'>
						<motion.ul
							className='flex flex-col gap-2 px-4 overflow-y-auto'
							variants={container}
							initial='hidden'
							animate='show'
						>
							{notCompleted.map((item) => (
								<motion.li
									className='border rounded-lg p-4 bg-[#2c2c38] border-transparent flex gap-4'
									variants={lowerContainer}
									key={item.taskId}
								>
									<div className='flex flex-col flex-1 overflow-hidden break-words'>
										<h4 className='text-xl font-bold tracking-tight text-[#f0f1f7]'>
											{' '}
											{item.taskTitle}
										</h4>
										<h1 className='text-[#999fac] flex-1 overflow-hidden break-words'>
											{item.taskDescription}
										</h1>
									</div>

									<div className='flex gap-2 place-items-center'>
										<button
											className=' text-[#f0f1f7] bg-green-800 rounded-lg p-4'
											onClick={() => {
												completeTaskFunction(
													item.taskId
												);
												moveCompletedTask(item.taskId);
											}}
										>
											Complete
										</button>
										<button
											className='text-[#f0f1f7] bg-red-800 rounded-lg p-4'
											onClick={() => {
												deleteTaskFunction(item.taskId);
												deleteNotCompletedTask(
													item.taskId
												);
											}}
										>
											Delete
										</button>
									</div>
								</motion.li>
							))}
						</motion.ul>
					</div>
				</motion.div>
				<motion.div className='flex flex-col overflow-y-hidden'>
					<div className='flex flex-col p-4 place-items-center'>
						<h1 className='text-3xl font-bold tracking-tight text-[#f0f1f7] text-center p-4'>
							Completed
						</h1>
						<button
							className='text-3xl font-bold tracking-tight text-[#f0f1f7] bg-[#2c2c38] p-2 border rounded-lg border-transparent max-w-fit'
							onClick={() => {
								const arrayOfCompletedIds = completed.map(
									(obj) => obj.taskId
								);
								deleteCompletedTasksFunction(
									arrayOfCompletedIds
								);
								setCompleted([]);
							}}
						>
							Clear All
						</button>
					</div>
					<motion.ul
						className='flex flex-col gap-2 overflow-y-auto px-4'
						variants={container}
						initial='hidden'
						animate='show'
					>
						{completed.map((item) => (
							<motion.li
								className='border rounded-lg p-4 bg-[#2c2c38] border-transparent flex gap-4'
								variants={lowerContainer}
								key={item.taskId}
							>
								<div className='flex flex-col flex-1 overflow-hidden break-words'>
									<h4 className='text-xl font-bold tracking-tight text-[#f0f1f7]'>
										{' '}
										{item.taskTitle}
									</h4>
									<h1 className='text-[#999fac] flex-1 overflow-hidden break-words'>
										{item.taskDescription}
									</h1>
								</div>

								<div className='flex gap-2 place-items-center'>
									<button
										className='text-[#f0f1f7] bg-red-800 rounded-lg p-4'
										onClick={() => {
											deleteTaskFunction(item.taskId);
											deleteCompletedTask(item.taskId);
										}}
									>
										Delete
									</button>
								</div>
							</motion.li>
						))}
					</motion.ul>
				</motion.div>
			</div>
		</div>
	);
};

export default DashboardPage;
