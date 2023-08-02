import { Html, Head, Main, NextScript } from 'next/document';
import { Toaster } from 'react-hot-toast';

export default function Document() {
	return (
		<Html lang='en'>
			<Head />
			<body className='bg-[#999fac]'>
				<Toaster />
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
