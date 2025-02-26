import { Routes, Route } from 'react-router-dom';
import { SignUp } from './routes/SignUp';
import { About } from './routes/About';
import { Landing } from './routes/Landing';
import { Login } from './routes/Login';
import { User } from './routes/User';
import { SignUpSuccess } from './routes/SignUpSuccess';
import { Search } from './routes/Search';
import { Profile } from './routes/Profile';
import { Test3D } from './routes/Test3D';
import { Studio } from './routes/Studio';

export const Main = () => (
	<Routes>
		<Route path="/" element={<Landing />} />
		<Route path="/about" element={<About />} />
		<Route path="/signup" element={<SignUp />} />
		<Route path="/login" element={<Login />} />
		<Route path="/user" element={<User />} />
		<Route path="/signup_success" element={<SignUpSuccess />} />
		<Route path="/search" element={<Search />} />
		<Route path="/profile" element={<Profile />} />
		<Route path="/studio" element={<Studio />} />
		<Route path="/test3d" element={<Test3D />} />
	</Routes>
);
