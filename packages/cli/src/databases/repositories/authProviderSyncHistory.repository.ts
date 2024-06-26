import { Service } from 'typedi';
import { DataSource, Repository } from '@flowease/typeorm';
import { AuthProviderSyncHistory } from '../entities/AuthProviderSyncHistory';

@Service()
export class AuthProviderSyncHistoryRepository extends Repository<AuthProviderSyncHistory> {
	constructor(dataSource: DataSource) {
		super(AuthProviderSyncHistory, dataSource.manager);
	}
}
