import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useEffect, useState, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// PocketBase
import { pb } from "src/utils/pocketbase";
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JobNewEditForm({ currentProject }) {
  const router = useRouter();

  const empresasRef = useRef([]);
  const [getEmpresas, setGetEmpresas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const empresasData = await pb.collection('empresas').getFullList({ filter: `user_id="${pb.authStore.model?.id}" && estatus="Aceptado"`});
      empresasRef.current = empresasData;
      setGetEmpresas(empresasData);
    };
    fetchData();
  }, []);

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const newProjectSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre del proyecto es requerido'),
    obj_general: Yup.string().required('El objetivo general es requerido'),
    descripcion: Yup.string().required('La descripción es requerida'),
    actividades: Yup.string().required('Las actividades son requeridas'),
    empresa_id: Yup.string().required('La empresa a la que va dirigida el proyecto es requerida')
  })

  const defaultValues = useMemo(
    () => ({
      nombre: currentProject?.nombre || '',
      obj_general: currentProject?.obj_general || '',
      descripcion: currentProject?.descripcion || '',
      actividades: currentProject?.actividades || '',
      empresa_id: currentProject?.empresa_id,
      user_id: pb.authStore.model?.id,
      estatus: "En revision"
    }),
    [currentProject]
  );

  const methods = useForm({
    resolver: yupResolver(newProjectSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentProject) {
      reset(defaultValues);
    }
  }, [currentProject, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await pb.collection('proyectos').create(data);
      reset();
      enqueueSnackbar(currentProject ? 'Proyecto actualizado con exito' : 'Proyecto creado correctamente');
      router.push(paths.solicitante.proyectos.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Datos del proyecto
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Nombre, Objetivo general, Descripción...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Nombre del proyecto</Typography>
              <RHFTextField name="nombre" placeholder="Ej: App Movil..." />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Objetivo general</Typography>
              <RHFTextField name="obj_general" placeholder="Ej: Se desea desarrollar una app movil..." />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Descripción</Typography>
              <RHFEditor simple name="descripcion" />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Actividades a realizar</Typography>
              <RHFEditor simple name="actividades" />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Empresa
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Entidad a la que se le desarrollara el proyecto.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Seleccionar empresa</Typography>
              <RHFAutocomplete
                name="empresa_id"
                autoHighlight
                options={getEmpresas}
                getOptionLabel={(option) => option.nombre}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.nombre}
                  </li>
                )}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentProject ? 'Crear Proyecto' : 'Guardar cambios'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderProperties}
        
        {renderDetails}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

JobNewEditForm.propTypes = {
  currentProject: PropTypes.object,
};
