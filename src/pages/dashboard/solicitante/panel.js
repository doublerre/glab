import { Helmet } from 'react-helmet-async';
// sections
import { OverviewAppView } from 'src/sections/Solicitante/panel/app/view';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Solicitante</title>
      </Helmet>

      <OverviewAppView />
    </>
  );
}
