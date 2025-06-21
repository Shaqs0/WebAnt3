import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { Characters, Episodes, Locations } from './pages';
// import { Provider } from 'react-redux'
// import { store } from './store/store'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout/>,
		children: [
			{
				path:'/',
				element: <Characters/>
			},
			{
				path:'/episodes',
				element: <Episodes/>
			},
			{
				path:'/locations',
				element: <Locations/>
			}
		]
	}
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		{/* <Provider store={store}> */}
		<RouterProvider router = {router}/>
		{/* </Provider> */}
	</StrictMode>,
);
