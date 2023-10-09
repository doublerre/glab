import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
import { pb } from "src/utils/pocketbase";
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
	user: null,
	loading: true,
};

const reducer = (state, action) => {
	if (action.type === 'INITIAL') {
		return {
			loading: false,
			user: action.payload.user,
		};
	}
	if (action.type === 'LOGIN') {
		return {
			...state,
			user: action.payload.user,
		};
	}
	if (action.type === 'REGISTER') {
		return {
			...state,
			user: action.payload.user,
		};
	}
	if (action.type === 'LOGOUT') {
		return {
			...state,
			user: null,
		};
	}
	return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);

	const initialize = useCallback(async () => {
		try {
			const accessToken = sessionStorage.getItem(STORAGE_KEY);

			if (accessToken && isValidToken(accessToken)) {
				setSession(accessToken);

				const response = await axios.get(endpoints.auth.me);

				const { user } = response.data;

				dispatch({
					type: 'INITIAL',
					payload: {
						user: {
							...user,
							accessToken,
						},
					},
				});
			} else {
				dispatch({
					type: 'INITIAL',
					payload: {
						user: null,
					},
				});
			}
		} catch (error) {
			console.error(error);
			dispatch({
				type: 'INITIAL',
				payload: {
					user: null,
				},
			});
		}
	}, []);

	useEffect(() => {
		initialize();
	}, [initialize]);

	// LOGIN
	const login = useCallback(async (email, password) => {

		await pb.collection('users').authWithPassword(email, password);
		if (pb.authStore.model.verified !== false) {
			const accessToken = pb.authStore.token;
			const user = pb.authStore.model;
			setSession(accessToken);

			dispatch({
				type: 'LOGIN',
				payload: {
					user: {
						...user,
						accessToken,
					},
				},
			});
		} else {
			throw new Error("Error, no has activado tu cuenta.")
		}
	}, []);

	// REGISTER Solicitante
	const register = useCallback(async (email, password, passwordConfirm, name, username, rol, emailVisibility) => {
		const data = {
			name,
			username,
			email,
			password,
			passwordConfirm,
			rol,
			emailVisibility,
		};

		const record = await pb.collection('users').create(data);
		await pb.collection('users').requestVerification(data.email);

		if (record.verified === false) throw new Error("Se ha enviado un correo electronico para que pueda confirmar su cuenta. Recuerde revisar la carpeta de SPAM.")
		dispatch({
			type: 'REGISTER',
			payload: {
			},
		});
	}, []);

	// LOGOUT
	const logout = useCallback(async () => {
		setSession(null);
		pb.authStore.clear();
		dispatch({
			type: 'LOGOUT',
		});
	}, []);

	// ----------------------------------------------------------------------

	const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

	const status = state.loading ? 'loading' : checkAuthenticated;

	const memoizedValue = useMemo(
		() => ({
			user: state.user,
			method: 'jwt',
			loading: status === 'loading',
			authenticated: status === 'authenticated',
			unauthenticated: status === 'unauthenticated',
			//
			login,
			register,
			logout,
		}),
		[login, logout, register, state.user, status]
	);

	return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
	children: PropTypes.node,
};
