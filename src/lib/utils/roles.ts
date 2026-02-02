// Role hierarchy for ADOLF system
// pending(0) → staff(1) → manager(2) → senior(3) → director(4) → admin(5)

export const ROLE_HIERARCHY: Record<string, number> = {
	pending: 0,
	staff: 1,
	manager: 2,
	senior: 3,
	director: 4,
	admin: 5
};

export type ModuleName =
	| 'knowledge'
	| 'knowledge_moderation'
	| 'content_factory'
	| 'cfo'
	| 'cfo_full'
	| 'reputation'
	| 'watcher'
	| 'marketing'
	| 'scout'
	| 'lex'
	| 'admin_panel';

// Module access requirements - minimum role needed
const MODULE_ACCESS: Record<ModuleName, string> = {
	knowledge: 'staff',
	knowledge_moderation: 'senior',
	content_factory: 'senior',
	cfo: 'senior',
	cfo_full: 'director',
	reputation: 'staff',
	watcher: 'manager',
	marketing: 'manager',
	scout: 'manager',
	lex: 'senior',
	admin_panel: 'admin'
};

/**
 * Check if user has at least the minimum required role
 */
export function hasMinRole(userRole: string | undefined | null, requiredRole: string): boolean {
	if (!userRole || !requiredRole) return false;
	const userLevel = ROLE_HIERARCHY[userRole.toLowerCase()] ?? -1;
	const requiredLevel = ROLE_HIERARCHY[requiredRole.toLowerCase()] ?? 999;
	return userLevel >= requiredLevel;
}

/**
 * Check if user can access a specific module
 */
export function canAccessModule(role: string | undefined | null, module: ModuleName): boolean {
	const requiredRole = MODULE_ACCESS[module];
	if (!requiredRole) return false;
	return hasMinRole(role, requiredRole);
}

/**
 * Get all modules accessible by a role
 */
export function getAccessibleModules(role: string | undefined | null): ModuleName[] {
	if (!role) return [];
	return (Object.keys(MODULE_ACCESS) as ModuleName[]).filter((module) =>
		canAccessModule(role, module)
	);
}
