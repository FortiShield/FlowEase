import { Container } from 'typedi';
import { License } from '@/License';
import { BaseCommand } from '../BaseCommand';

export class LicenseInfoCommand extends BaseCommand {
	static description = 'Print license information';

	static examples = ['$ flowease license:info'];

	async run() {
		const license = Container.get(License);
		await license.init();

		this.logger.info('Printing license information:\n' + license.getInfo());
	}

	async catch(error: Error) {
		this.logger.error('\nGOT ERROR');
		this.logger.info('====================================');
		this.logger.error(error.message);
	}
}
