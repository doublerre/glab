import { Helmet } from 'react-helmet-async';
// sections
import { UserListView } from 'src/sections/Solicitante/panel/instituciones/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Lista de instituciones</title>
      </Helmet>

      <UserListView />
    </>
  );
}
