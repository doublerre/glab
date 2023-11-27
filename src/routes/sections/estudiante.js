import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
// auth
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Rutas del Estudiante
const IndexPage = lazy(() => import('src/pages/dashboard/estudiante/proyectos/list'))
const ProjectDetailsPage = lazy(() => import('src/pages/dashboard/estudiante/proyectos/details'))

export const estudiantesRoutes = [
    {
        path: 'estudiante',
        element: (
            <AuthGuard>
                <DashboardLayout>
                    <Suspense fallback={<LoadingScreen />}>
                        <RoleBasedGuard hasContent roles={["Estudiante"]}>
                            <Outlet />
                        </RoleBasedGuard>
                    </Suspense>
                </DashboardLayout>
            </AuthGuard>
        ),
        children: [
            {element: <IndexPage />, index: true},
            {
                path: 'proyectos',
                children: [
                  { element: <IndexPage />, index: true },
                  { path: 'lista', element: <IndexPage /> },
                  { path: ':id', element: <ProjectDetailsPage /> },
                ],
            },
        ]
    }
]