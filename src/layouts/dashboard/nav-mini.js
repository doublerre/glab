// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// theme
import { hideScroll } from 'src/theme/css';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Logo from 'src/components/logo';
import { NavSectionMini } from 'src/components/nav-section';
//
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import { useNavData as NavSolicitante } from './menu-navigation-solicitante';
import { useNavData as NavEstudiante } from "./menu-navigation-estudiante";
import { NavToggleButton } from '../_common';

// ----------------------------------------------------------------------

export default function NavMini() {
	const { user } = useAuthContext();

	const navData = useNavData();
	const navDataSolicitante = NavSolicitante();
	const navDataEstudiante = NavEstudiante();

	return (
		<Box
			component="nav"
			sx={{
				flexShrink: { lg: 0 },
				width: { lg: NAV.W_MINI },
			}}
		>
			<NavToggleButton
				sx={{
					top: 22,
					left: NAV.W_MINI - 12,
				}}
			/>

			<Stack
				sx={{
					pb: 2,
					height: 1,
					position: 'fixed',
					width: NAV.W_MINI,
					borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
					...hideScroll.x,
				}}
			>
				<Logo sx={{ mx: 'auto', my: 2 }} />
				{
					user?.role === 'Solicitante' && (
						<NavSectionMini
							data={navDataSolicitante}
							config={{
								currentRole: "Solicitante",
							}}
						/>
					)}
				{
					user?.role === 'Estudiante' && (
						<NavSectionMini
							data={navDataEstudiante}
							config={{
								currentRole: "Estudiante",
							}}
						/>
					)}
			</Stack>
		</Box>
	);
}
