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
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
// routes
import { paths } from 'src/routes/paths';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
	const { login } = useAuthContext();

	const router = useRouter();

	const [errorMsg, setErrorMsg] = useState('');

	const searchParams = useSearchParams();

	const returnTo = searchParams.get('returnTo');

	const password = useBoolean();

	const LoginSchema = Yup.object().shape({
		email: Yup.string().required('El correo electronico o el usuario es requerido'),
		password: Yup.string().required('La contraseña es requerida'),
	});

	const defaultValues = {
		email: '',
		password: '',
	};

	const methods = useForm({
		resolver: yupResolver(LoginSchema),
		defaultValues,
	});

	const {
		reset,
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	const onSubmit = handleSubmit(async (data) => {
		try {
			await login?.(data.email, data.password);

			router.push(returnTo || PATH_AFTER_LOGIN);
		} catch (error) {
			console.error(error);
			reset();
			setErrorMsg(typeof error === 'string' ? error : error.message);
		}
	});

	const renderHead = (
		<Stack spacing={2} sx={{ mb: 5 }}>
			<Typography variant="h4">GLab</Typography>
		</Stack>
	);

	const renderForm = (
		<Stack spacing={2.5}>
			{!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

			<RHFTextField name="email" label="Correo electronico o usuario" />

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

			<Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
				Olvidaste tu contraseña?
			</Link>

			<LoadingButton
				fullWidth
				color="inherit"
				size="large"
				type="submit"
				variant="contained"
				loading={isSubmitting}
			>
				Iniciar Sesion
			</LoadingButton>
			<Divider />

			<Button
				fullWidth
				color="primary"
				size="large"
				variant="contained"
				href={paths.auth.jwt.register}
			>
				Registro de solicitantes
			</Button>
			<Button
				fullWidth
				color="primary"
				size="large"
				variant="contained"
				href={paths.auth.jwt.registerAlumno}
			>
				Registro de Alumnos
			</Button>

		</Stack>
	);

	return (
		<FormProvider methods={methods} onSubmit={onSubmit}>
			{renderHead}
			{renderForm}
		</FormProvider>
	);
}
