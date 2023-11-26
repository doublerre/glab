import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// theme
import { bgBlur } from 'src/theme/css';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import { NavSectionHorizontal } from 'src/components/nav-section';
//
import { HEADER } from '../config-layout';
import { useNavData } from './config-navigation';
import { useNavData as NavSolicitante } from './menu-navigation-solicitante';
import { useNavData as NavEstudiante } from "./menu-navigation-estudiante";
import { HeaderShadow } from '../_common';

// ----------------------------------------------------------------------

function NavHorizontal() {
	const theme = useTheme();

	const { user } = useAuthContext();

	const navData = useNavData();
	const navDataSolicitante = NavSolicitante();
	const navDataEstudiante = NavEstudiante();
	return (
		<AppBar
			component="nav"
			sx={{
				top: HEADER.H_DESKTOP_OFFSET,
			}}
		>
			<Toolbar
				sx={{
					...bgBlur({
						color: theme.palette.background.default,
					}),
				}}
			>
				{
					user?.role === 'Solicitante' && (
						<NavSectionHorizontal
							data={navDataSolicitante}
							config={{
								currentRole: "Solicitante",
							}}
						/>
					)}
				{
					user?.role === 'Estudiante' && (
						<NavSectionHorizontal
							data={navDataEstudiante}
							config={{
								currentRole: "Estudiante",
							}}
						/>
					)}
			</Toolbar>

			<HeaderShadow />
		</AppBar>
	);
}

export default memo(NavHorizontal);
