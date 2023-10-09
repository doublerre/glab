import { Helmet } from 'react-helmet-async';
// sections
import { JwtRegisterAlumnoView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
      </Helmet>

      <JwtRegisterAlumnoView />
    </>
  );
}
