import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import { useState, useCallback, useRef, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// _mock
import {
  _jobs,
} from 'src/_mock';
// PocketBase
import { pb } from "src/utils/pocketbase";
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import JobList from '../job-list';
import JobSearch from '../job-search';
import JobFiltersResult from '../job-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  roles: [],
  locations: [],
  benefits: [],
  experience: 'all',
  employmentTypes: [],
};

// ----------------------------------------------------------------------

export default function JobListView() {
  const settings = useSettingsContext();

  const empresasRef = useRef([])
  const [empresas, setEmpresas] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const empresasData = await pb.collection('proyectos').getFullList({ expand: "empresa_id", filter: `user_id="${pb.authStore.model?.id}"`});
      empresasRef.current = empresasData;
      setEmpresas(empresasData);
      console.log(empresasData);
    };
    fetchData();
  }, []);

  const [sortBy, setSortBy] = useState('latest');

  const [search, setSearch] = useState({
    query: '',
    results: [],
  });

  const [filters, setFilters] = useState(defaultFilters);

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSearch = useCallback(
    (inputValue) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = _jobs.filter(
          (job) => job.title.toLowerCase().indexOf(search.query.toLowerCase()) !== -1
        );

        setSearch((prevState) => ({
          ...prevState,
          results,
        }));
      }
    },
    [search.query]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <JobSearch
        query={search.query}
        results={search.results}
        onSearch={handleSearch}
        hrefItem={(id) => paths.dashboard.job.details(id)}
      />
    </Stack>
  );

  const renderResults = (
    <JobFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
    />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Lista de proyectos"
        links={[
          { name: 'Dashboard', href: paths.solicitante.root },
          {
            name: 'Proyectos',
            href: paths.solicitante.proyectos.root,
          },
          { name: 'Lista' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.job.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Nuevo proyecto
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      <JobList jobs={empresas} />
    </Container>
  );
}