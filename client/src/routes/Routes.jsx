import { Navigate, Route, Routes as RoutesWrapper } from "react-router-dom";
import { mainLayoutRoutes, publicRoutes } from "./const";

const Routes = () => {
    const isAuthenticated = localStorage.getItem("token") !== null;

    return (
        <RoutesWrapper>
            {publicRoutes.routes.map(({ path, Component }) => (
                <Route
                    key={path}
                    path={path}
                    element={
                        isAuthenticated ? (
                            <Navigate to="/" replace />
                        ) : (
                            <publicRoutes.Layout>
                                <Component />
                            </publicRoutes.Layout>
                        )
                    }
                />
            ))}
            {mainLayoutRoutes.routes.map(({ path, Component }) => (
                <Route
                    key={path}
                    path={path}
                    element={
                        isAuthenticated ? (
                            <mainLayoutRoutes.Layout>
                                <Component />
                            </mainLayoutRoutes.Layout>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            ))}
        </RoutesWrapper>
    );
};

export default Routes;


// import { Route, Routes as RoutesWrapper } from "react-router-dom";
// import { mainLayoutRoutes, publicRoutes } from "./const";

// const Routes = () => {
//     const token = localStorage.getItem('token');
//     const isAuthenticated = token !== null;
//     console.log(isAuthenticated);
//     const { routes, Layout } = isAuthenticated ? mainLayoutRoutes : publicRoutes;

//     return (
//         <RoutesWrapper>
//             {routes.map(({ path, Component }) => (
//                 <Route
//                     key={path}
//                     path={path}
//                     element={
//                         <Layout>
//                             <Component />
//                         </Layout>
//                     }
//                 />
//             ))}
//         </RoutesWrapper>
//     );
// };

// export default Routes;
