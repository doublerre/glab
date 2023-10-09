import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
	const { register } = useAuthContext();

	const router = useRouter();

	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');

	const searchParams = useSearchParams();

	const returnTo = searchParams.get('returnTo');

	const password = useBoolean();
	const passwordConfirm = useBoolean();

	const RegisterSchema = Yup.object().shape({
		name: Yup.string().required('El nombre completo es requerido'),
		username: Yup.string().required('El usuario es requerido'),
		email: Yup.string().required('El correo electronico es requerido').email('Debes escribir un correo electronico valido'),
		password: Yup.string().required('La contraseña es requerida').min(8, 'La contraseña no debe ser menor a 8 caracteres'),
		passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir'),
	});

	const defaultValues = {
		name: '',
		username: '',
		email: '',
		password: '',
		passwordConfirm: '',
	};

	const methods = useForm({
		resolver: yupResolver(RegisterSchema),
		defaultValues,
	});

	const {
		reset,
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	const onSubmit = handleSubmit(async (data) => {
		try {
			await register?.(data.email, data.password, data.passwordConfirm, data.name, data.username, "Estudiante", true);

			router.push(returnTo || PATH_AFTER_LOGIN);
		} catch (error) {
			console.error(error);
			reset();
			if (error.message === 'Se ha enviado un correo electronico para que pueda confirmar su cuenta. Recuerde revisar la carpeta de SPAM.') {
				setSuccessMsg(typeof error === 'string' ? error : error.message)
			} else {
				setErrorMsg(typeof error === 'string' ? error : error.message);
			}
		}
	});

	const renderHead = (
		<Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
			<Typography variant="h4">Registro de Alumnos</Typography>

			<Stack direction="row" spacing={0.5}>
				<Typography variant="body2"> Ya tienes cuenta? </Typography>

				<Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
					Inicia sesion
				</Link>
			</Stack>
		</Stack>
	);

	const renderTerms = (
		<Typography
			component="div"
			sx={{
				color: 'text.secondary',
				mt: 2.5,
				typography: 'caption',
				textAlign: 'center',
			}}
		>
			{'Al registrarme acepto los '}
			<Link underline="always" color="text.primary">
				Terminos de servicio
			</Link>
			{' y la '}
			<Link underline="always" color="text.primary">
				Politica de Privacidad
			</Link>
			{' de GLab.'}
		</Typography>
	);

	const renderForm = (
		<FormProvider methods={methods} onSubmit={onSubmit}>
			<Stack spacing={2.5}>
				{!!successMsg && <Alert severity="success">{successMsg}</Alert>}
				{!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

				<RHFTextField name="name" label="Nombre Completo" />
				<RHFTextField name="email" label="Correo electronico" />
				<RHFTextField name="username" label="Usuario" />
				<RHFTextField
					name="password"
					label="Contraseña"
					type={password.value ? 'text' : 'password'}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={password.onToggle} edge="end">
									<Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				<RHFTextField
					name="passwordConfirm"
					label="Confirmar Contraseña"
					type={passwordConfirm.value ? 'text' : 'password'}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={passwordConfirm.onToggle} edge="end">
									<Iconify icon={passwordConfirm.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>

				<LoadingButton
					fullWidth
					color="inherit"
					size="large"
					type="submit"
					variant="contained"
					loading={isSubmitting}
				>
					Crear cuenta
				</LoadingButton>
			</Stack>
		</FormProvider>
	);

	return (
		<>
			{renderHead}

			{renderForm}

			{renderTerms}
		</>
	);
}
