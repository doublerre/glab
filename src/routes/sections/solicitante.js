import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Rutas del Solicitante
const IndexPage = lazy(() => import('src/pages/dashboard/solicitante/panel'));
// Rutas de los proyectos del solicitante
const ListPage = lazy(() => import('src/pages/dashboard/solicitante/proyectos/list'))
const CreateProjectPage = lazy(() => import('src/pages/dashboard/solicitante/proyectos/new'))
const EditProjectPage = lazy(() => import('src/pages/dashboard/solicitante/proyectos/edit'))
const ProjectDetailsPage = lazy(() => import('src/pages/dashboard/solicitante/proyectos/details'))
// Rutas de las instituciónes del solicitante

export const solicitanteRoutes = [
    {
        path: 'solicitante',
        element: (
            <AuthGuard>
                <DashboardLayout>
                    <Suspense fallback={<LoadingScreen />}>
                        <RoleBasedGuard hasContent roles={["Solicitante"]}>
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
                  { element: <ListPage />, index: true },
                  { path: 'lista', element: <ListPage /> },
                  { path: 'crear', element: <CreateProjectPage /> },
                  { path: ':id', element: <ProjectDetailsPage /> },
                  { path: ':id/editar', element: <EditProjectPage /> },
                ],
              },
        ]
    }
]