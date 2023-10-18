import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// PocketBase
import { pb } from "src/utils/pocketbase";
// Components
import { useSnackbar } from 'src/components/snackbar';
//
import JobItem from './project-item';

// ----------------------------------------------------------------------

export default function JobList({ jobs }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleView = useCallback(
    (id) => {
      router.push(paths.solicitante.proyectos.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id) => {
      router.push(paths.solicitante.proyectos.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback(async(id) => {
    await pb.collection('proyectos').delete(id)
    router.reload();
    enqueueSnackbar('Proyecto eliminado correctamente');
  }, [router, enqueueSnackbar]);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {jobs.map((job) => (
          <JobItem
            key={job.id}
            job={job}
            onView={() => handleView(job.id)}
            onEdit={() => handleEdit(job.id)}
            onDelete={() => handleDelete(job.id)}
          />
        ))}
      </Box>

      {jobs.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

JobList.propTypes = {
  jobs: PropTypes.array,
};
