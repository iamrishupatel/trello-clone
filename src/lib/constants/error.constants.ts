// contains app-write error types
const ERROR_TYPES = Object.freeze({
	USER_NOT_FOUND: 'user_not_found',
	USER_INVALID_TOKEN: 'user_invalid_token',
	ACCESS_DENIED: 'access_denied',
	DOCUMENT_NOT_FOUND: 'document_not_found',
	MEMBERSHIP_ALREADY_CONFIRMED: 'membership_already_confirmed',
	TEAM_INVITE_ALREADY_EXISTS: 'team_invite_already_exists',
});

export default ERROR_TYPES;
