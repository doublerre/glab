import { Helmet } from 'react-helmet-async';
// sections
import { UserCreateView } from 'src/sections/Solicitante/panel/instituciones/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Crear nueva institución</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
