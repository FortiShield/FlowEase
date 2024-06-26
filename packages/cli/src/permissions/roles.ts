import type { Scope } from '@flowease/permissions';

export const ownerPermissions: Scope[] = [
	'auditLogs:manage',
	'banner:dismiss',
	'credential:create',
	'credential:read',
	'credential:update',
	'credential:delete',
	'credential:list',
	'credential:share',
	'communityPackage:install',
	'communityPackage:uninstall',
	'communityPackage:update',
	'communityPackage:list',
	'eventBusEvent:create',
	'eventBusEvent:read',
	'eventBusEvent:update',
	'eventBusEvent:delete',
	'eventBusEvent:list',
	'eventBusEvent:query',
	'eventBusEvent:create',
	'eventBusDestination:create',
	'eventBusDestination:read',
	'eventBusDestination:update',
	'eventBusDestination:delete',
	'eventBusDestination:list',
	'eventBusDestination:test',
	'externalSecretsProvider:create',
	'externalSecretsProvider:read',
	'externalSecretsProvider:update',
	'externalSecretsProvider:delete',
	'externalSecretsProvider:list',
	'externalSecretsProvider:sync',
	'externalSecret:list',
	'externalSecret:use',
	'ldap:manage',
	'ldap:sync',
	'license:manage',
	'logStreaming:manage',
	'orchestration:read',
	'orchestration:list',
	'saml:manage',
	'sourceControl:pull',
	'sourceControl:push',
	'sourceControl:manage',
	'tag:create',
	'tag:read',
	'tag:update',
	'tag:delete',
	'tag:list',
	'user:create',
	'user:read',
	'user:update',
	'user:delete',
	'user:list',
	'user:resetPassword',
	'user:changeRole',
	'variable:create',
	'variable:read',
	'variable:update',
	'variable:delete',
	'variable:list',
	'workflow:create',
	'workflow:read',
	'workflow:update',
	'workflow:delete',
	'workflow:list',
	'workflow:share',
	'workflow:execute',
	'workersView:manage',
];
export const adminPermissions: Scope[] = ownerPermissions.concat();
export const memberPermissions: Scope[] = [
	'eventBusEvent:list',
	'eventBusEvent:read',
	'eventBusDestination:list',
	'eventBusDestination:test',
	'tag:create',
	'tag:read',
	'tag:update',
	'tag:list',
	'user:list',
	'variable:list',
	'variable:read',
];
