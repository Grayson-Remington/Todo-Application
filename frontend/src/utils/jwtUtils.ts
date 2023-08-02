// utils/jwtUtils.ts

import Cookies from 'js-cookie';

const JWT_COOKIE = 'jwtToken';
const USERNAME_COOKIE = 'username';

export function setJwtToken(jwtToken: string, expirationDays: number) {
	Cookies.set(JWT_COOKIE, jwtToken, { expires: expirationDays });
}

export function getJwtToken(): string | undefined {
	return Cookies.get(JWT_COOKIE);
}

export function removeJwtToken() {
	Cookies.remove(JWT_COOKIE);
}

export function setUsernameCookie(username: string, expirationDays: number) {
	Cookies.set(USERNAME_COOKIE, username, { expires: expirationDays });
}

export function getUsernameCookie(): string | undefined {
	return Cookies.get(USERNAME_COOKIE);
}

export function removeUsernameCookie() {
	Cookies.remove(USERNAME_COOKIE);
}
