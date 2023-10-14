import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// PocketBase
import { pb } from "src/utils/pocketbase";
// React
import { useEffect, useState, useRef } from "react";
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import JobNewEditForm from '../project-edit-form';

// ----------------------------------------------------------------------

export default function JobEditView({ id }) {
  const settings = useSettingsContext();

  const proyectoRef = useRef([])
  const [Proyecto, setProyecto] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const currentProject = await pb.collection('proyectos').getOne(id)
      proyectoRef.current = currentProject
      setProyecto(currentProject)
    };
    fetchData();
  }, [id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Editar proyecto"
        links={[
          {
            name: 'Dashboard',
            href: paths.solicitante.root,
          },
          {
            name: 'Proyectos',
            href: paths.solicitante.proyectos.root,
          },
          { name: Proyecto?.nombre },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {Proyecto ? (
        <JobNewEditForm currentProject={Proyecto} />
      ) : (
        <div>
          <p>Cargando...</p>
        </div>
      )}
      
    </Container>
  );
}

JobEditView.propTypes = {
  id: PropTypes.string,
};
