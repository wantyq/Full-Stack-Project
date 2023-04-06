import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import MainLayout from "../layouts/MainLayout";
import PublicLayout from "../layouts/PublicLayout";
import Questions from "../pages/Questions/Questions";
import Register from "../pages/Register/Register";

export const HOME_PATH = '/';
export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/register';
export const QUESTIONS_PATH = '/questions';

export const mainLayoutRoutes = {
    Layout: MainLayout,
    routes: [
    { path: HOME_PATH, Component: Questions},
    { path: LOGIN_PATH, Component: Login},
    { path: REGISTER_PATH, Component: Register},
    { path: QUESTIONS_PATH, Component: Home},
]
}


export const publicRoutes = {
  Layout: PublicLayout,
  routes: [
    { path: LOGIN_PATH, Component: Login },
    { path: REGISTER_PATH, Component: Register },
  ],
};