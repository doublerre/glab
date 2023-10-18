import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
// PocketBase
import { pb } from "src/utils/pocketbase";
//
import JobDetailsToolbar from '../project-details-toolbar';
import JobDetailsContent from '../project-details-content';

// ----------------------------------------------------------------------

export default function JobDetailsView({ id }) {
  const settings = useSettingsContext();

  const proyectoRef = useRef([])
  const [proyecto, setProyecto] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const currentProject = await pb.collection('proyectos').getOne(id, {expand: "user_id,empresa_id"})
      proyectoRef.current = currentProject
      setProyecto(currentProject)
    };
    fetchData();
  }, [id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <JobDetailsToolbar
        backLink={paths.solicitante.proyectos.root}
        editLink={paths.solicitante.proyectos.edit(`${proyecto?.id}`)}
        liveLink="#"
      />

      <JobDetailsContent job={proyecto} />
    </Container>
  );
}

JobDetailsView.propTypes = {
  id: PropTypes.string,
};
