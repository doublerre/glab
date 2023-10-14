import { Helmet } from 'react-helmet-async';
// sections
import { JobListView } from 'src/sections/Solicitante/panel/proyectos/view';

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
