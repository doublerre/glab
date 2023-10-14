// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import JobNewEditForm from '../job-new-edit-form';

// ----------------------------------------------------------------------

export default function JobCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crear nuevo proyecto"
        links={[
          {
            name: 'Dashboard',
            href: paths.solicitante.root,
          },
          {
            name: 'Proyectos',
            href: paths.solicitante.proyectos.root,
          },
          { name: 'Nuevo proyecto' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <JobNewEditForm />
    </Container>
  );
}
