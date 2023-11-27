import { Helmet } from 'react-helmet-async';
// sections
import { JobCreateView } from 'src/sections/estudiante/proyectos/view';

// ----------------------------------------------------------------------

export default function JobCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Crear nuevo proyecto</title>
      </Helmet>

      <JobCreateView />
    </>
  );
}
