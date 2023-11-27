import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { JobEditView } from 'src/sections/Solicitante/panel/proyectos/view';

// ----------------------------------------------------------------------

export default function JobEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Editar proyecto</title>
      </Helmet>

      <JobEditView id={`${id}`} />
    </>
  );
}
