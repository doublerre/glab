import PropTypes from 'prop-types';
// @mui
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDate } from 'src/utils/format-time';
// MomentJs
import moment from "moment";
// PocketBase
import { pb } from "src/utils/pocketbase";
// components
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';

// ----------------------------------------------------------------------

export default function JobDetailsContent({ job, urlImage }) {
  const {
    nombre,
    obj_general,
    descripcion,
    actividades,
    created,
    expand,
    empresa_id,
    estatus
  } = job;

  const expired = moment(created).add(1, 'year');

  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      <Typography variant="h4">{nombre}</Typography>
      <Typography variant="h6">Objetivo General:</Typography>
      <Markdown children={obj_general} />

      <Stack spacing={2}>
        <Typography variant="h6">Descripción:</Typography>
        <Markdown children={descripcion} />
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h6">Actividades a realizar:</Typography>
        <Markdown children={actividades} />
      </Stack>
    </Stack>
  );

  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3 }}>
      {[
        {
          label: 'Fecha de publicación',
          value: fDate(created),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Fecha de expiración',
          value: fDate(expired),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Estado del proyecto',
          value: estatus,
          icon: <Iconify icon="mdi:list-status" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      ))}
    </Stack>
  );

  const renderCompany = (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={2}
      direction="row"
      sx={{ p: 3, borderRadius: 2, mt: 3 }}
    >
      <Avatar
        alt={expand?.empresa_id.nombre}
        src={urlImage}
        variant="rounded"
        sx={{ width: 64, height: 64 }}
      />

      <Stack spacing={1}>
        <Typography variant="subtitle1">{expand?.empresa_id.nombre}</Typography>
        <Typography variant="body2">{expand?.empresa_id.direccion}</Typography>
        <Typography variant="body2">{expand?.empresa_id.giro}</Typography>
      </Stack>
    </Stack>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {renderContent}
      </Grid>

      <Grid xs={12} md={4}>
        {renderOverview}

        {renderCompany}
      </Grid>
    </Grid>
  );
}

JobDetailsContent.propTypes = {
  job: PropTypes.object,
  urlImage: PropTypes.string,
};
