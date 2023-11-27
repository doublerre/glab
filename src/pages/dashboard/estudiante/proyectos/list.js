import { Helmet } from 'react-helmet-async';
// sections
import { JobListView } from 'src/sections/estudiante/proyectos/view';

// ----------------------------------------------------------------------

export default function JobListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Proyectos</title>
      </Helmet>

      <JobListView />
    </>
  );
}
