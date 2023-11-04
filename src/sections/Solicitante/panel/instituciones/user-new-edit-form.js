import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// PocketBase
import { pb } from "src/utils/pocketbase";
// components
import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
	RHFTextField,
	RHFUploadAvatar,
	RHFUploadFile,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentUser }) {
	const router = useRouter();

	const { enqueueSnackbar } = useSnackbar();

	const newInstitucionSchema = Yup.object().shape({
		nombre: Yup.string().required('El nombre es requerido'),
		direccion: Yup.string().required('La dirección es requerida'),
		giro: Yup.string().required('El giro es requerido'),
		docAcreditador: Yup.mixed().required('El documento acreditador es requerido.'),
		// not required
		image: Yup.mixed().nullable().required('La imagen es requerida'),
	});

	const defaultValues = useMemo(
		() => ({
			nombre: currentUser?.nombre || '',
			direccion: currentUser?.direccion || '',
			giro: currentUser?.giro || '',
			docAcreditador: currentUser?.docAcreditador || null,
			image: currentUser?.image || null,
		}),
		[currentUser]
	);

	const methods = useForm({
		resolver: yupResolver(newInstitucionSchema),
		defaultValues,
	});

	const {
		reset,
		watch,
		control,
		setValue,
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	const values = watch();

	const onSubmit = handleSubmit(async (data) => {
		try {
			data.estatus = 'En revisión';
			data.user_id = pb.authStore.model.id;
			await pb.collection('empresas').create(data);
			reset();
			enqueueSnackbar(currentUser ? 'Update success!' : 'Institución creada con exito!');
			router.push(paths.solicitante.instituciones.root);
		} catch (error) {
			console.error(error);
		}
	});

	const handleDrop = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];

			const newFile = Object.assign(file, {
				preview: URL.createObjectURL(file),
			});

			if (file) {
				setValue('image', newFile, { shouldValidate: true });
			}
		},
		[setValue]
	);

	const handleDropFile = useCallback(
		(acceptedFiles) => {
		  const file = acceptedFiles[0];
	
		  const newFile = Object.assign(file, {
			preview: URL.createObjectURL(file),
		  });
	
		  if (file) {
			setValue('docAcreditador', newFile, { shouldValidate: true });
		  }
		},
		[setValue]
	  );

	const handleRemoveFile = useCallback(() => {
		setValue('docAcreditador', null);
	  }, [setValue]);

	return (
		<FormProvider methods={methods} onSubmit={onSubmit}>
			<Grid container spacing={3}>
				<Grid xs={12} md={4}>
					<Card sx={{ pt: 10, pb: 5, px: 3 }}>
						{currentUser && (
							<Label
								color={
									(values.status === 'active' && 'success') ||
									(values.status === 'banned' && 'error') ||
									'warning'
								}
								sx={{ position: 'absolute', top: 24, right: 24 }}
							>
								{values.status}
							</Label>
						)}

						<Box sx={{ mb: 5 }}>
							<RHFUploadAvatar
								name="image"
								maxSize={5242880}
								onDrop={handleDrop}
								helperText={
									<Typography
										variant="caption"
										sx={{
											mt: 3,
											mx: 'auto',
											display: 'block',
											textAlign: 'center',
											color: 'text.disabled',
										}}
									>
										Solo esta permitido archivos con extensión *.jpeg, *.jpg, *.png, *.gif,
										tamaño maximo del archivo: {fData(5242880)}
									</Typography>
								}
							/>
						</Box>

						{currentUser && (
							<FormControlLabel
								labelPlacement="start"
								control={
									<Controller
										name="status"
										control={control}
										render={({ field }) => (
											<Switch
												{...field}
												checked={field.value !== 'active'}
												onChange={(event) =>
													field.onChange(event.target.checked ? 'banned' : 'active')
												}
											/>
										)}
									/>
								}
								label={
									<>
										<Typography variant="subtitle2" sx={{ mb: 0.5 }}>
											Banned
										</Typography>
										<Typography variant="body2" sx={{ color: 'text.secondary' }}>
											Apply disable account
										</Typography>
									</>
								}
								sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
							/>
						)}

						{currentUser && (
							<Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
								<Button variant="soft" color="error">
									Delete User
								</Button>
							</Stack>
						)}
					</Card>
				</Grid>

				<Grid xs={12} md={8}>
					<Card sx={{ p: 3 }}>
						<Box
							rowGap={3}
							columnGap={2}
							display="grid"
						>
							<RHFTextField name="nombre" label="Nombre de la institución" />
							<RHFTextField name="direccion" label="Dirección de la institución" />
							<RHFTextField name="giro" label="Giro de la institución" />
							<RHFUploadFile
								name="docAcreditador"
								maxSize={3145728}
								onDrop={handleDropFile}
								onDelete={handleRemoveFile}
							/>
						</Box>

						<Stack alignItems="flex-end" sx={{ mt: 3 }}>
							<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
								{!currentUser ? 'Crear institución' : 'Actualizar Institución'}
							</LoadingButton>
						</Stack>
					</Card>
				</Grid>
			</Grid>
		</FormProvider>
	);
}

UserNewEditForm.propTypes = {
	currentUser: PropTypes.object,
};
