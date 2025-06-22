import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { CharacterDetails, Characters, EpisodeDetails, Episodes, LocationDetails, Locations } from './pages';
import { Provider } from 'react-redux'
import { store } from './store'

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
			},
			{
				path: '/character/:id', 
				element: <CharacterDetails />,
			},
			{
				path: '/episodes/:id',
				element: <EpisodeDetails/>
			},
			{
				path: '/locations/:id',
				element: <LocationDetails/>
			}
		]
	}
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
		<RouterProvider router = {router}/>
		</Provider>
	</StrictMode>,
);
