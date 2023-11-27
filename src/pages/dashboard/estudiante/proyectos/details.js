import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { JobDetailsView } from 'src/sections/Solicitante/panel/proyectos/view';
// ----------------------------------------------------------------------

export default function JobDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Detalles del proyecto</title>
      </Helmet>

      <JobDetailsView id={`${id}`} />
    </>
  );
}
