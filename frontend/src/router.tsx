import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginView from './views/login';
import Register
 from './views/register';
import AuthLayout from './layouts/Authlayout';
import AppLayout from './layouts/AppLayout';
import LinkTreeView from './views/LinkTreeView';
import ProfileView from './views/ProfileView';
export default function Router () {
    
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<AuthLayout/>}>
                        <Route path='/auth/login' element={<LoginView />} />
                        <Route path='/auth/register' element={<Register />} />
                    </Route>

                    <Route path='/admin' element={<AppLayout/>}>
                        <Route index={true} element={<LinkTreeView/>}/>
                        <Route path='profile' element={<ProfileView/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}