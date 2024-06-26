import { Container, Service } from 'typedi';
import type { DateTime } from 'luxon';
import { Push } from '@/push';
import { InternalHooks } from '@/InternalHooks';
import type { IRun, IRunExecutionData, ITaskData } from 'flowease-workflow';
import { NodeOperationError, WorkflowOperationError, sleep } from 'flowease-workflow';

import { ExecutionRepository } from '@db/repositories/execution.repository';
import { getWorkflowHooksMain } from '@/WorkflowExecuteAdditionalData';
import type { EventMessageTypes, EventNamesTypes } from './EventMessageClasses';

@Service()
export class ExecutionDataRecoveryService {
	constructor(
		private readonly push: Push,
		private readonly executionRepository: ExecutionRepository,
	) {}

	// eslint-disable-next-line complexity
	async recoverExecutionData(
		executionId: string,
		messages: EventMessageTypes[],
		applyToDb: boolean,
	): Promise<IRunExecutionData | undefined> {
		const executionEntry = await this.executionRepository.findSingleExecution(executionId, {
			includeData: true,
			unflattenData: true,
		});

		if (executionEntry && messages) {
			let executionData = executionEntry.data;
			let workflowError: WorkflowOperationError | undefined;
			if (!executionData) {
				executionData = { resultData: { runData: {} } };
			}
			let nodeNames: string[] = [];
			if (
				executionData?.resultData?.runData &&
				Object.keys(executionData.resultData.runData).length > 0
			) {
			} else {
				if (!executionData.resultData) {
					executionData.resultData = {
						runData: {},
					};
				} else {
					if (!executionData.resultData.runData) {
						executionData.resultData.runData = {};
					}
				}
			}
			nodeNames = executionEntry.workflowData.nodes.map((n) => n.name);

			let lastNodeRunTimestamp: DateTime | undefined = undefined;

			for (const nodeName of nodeNames) {
				const nodeByName = executionEntry?.workflowData.nodes.find((n) => n.name === nodeName);

				if (!nodeByName) continue;

				const nodeStartedMessage = messages.find(
					(message) =>
						message.eventName === 'flowease.node.started' && message.payload.nodeName === nodeName,
				);
				const nodeFinishedMessage = messages.find(
					(message) =>
						message.eventName === 'flowease.node.finished' && message.payload.nodeName === nodeName,
				);

				const executionTime =
					nodeStartedMessage && nodeFinishedMessage
						? nodeFinishedMessage.ts.diff(nodeStartedMessage.ts).toMillis()
						: 0;

				let taskData: ITaskData;
				if (executionData.resultData.runData[nodeName]?.length > 0) {
					taskData = executionData.resultData.runData[nodeName][0];
				} else {
					taskData = {
						startTime: nodeStartedMessage ? nodeStartedMessage.ts.toUnixInteger() : 0,
						executionTime,
						source: [null],
						executionStatus: 'unknown',
					};
				}

				if (nodeStartedMessage && !nodeFinishedMessage) {
					const nodeError = new NodeOperationError(
						nodeByName,
						'Node crashed, possible out-of-memory issue',
						{
							message: 'Execution stopped at this node',
							description:
								"flowease may have run out of memory while executing it. More context and tips on how to avoid this <a href='https://docs.flowease.khulnasoft.com/flow-logic/error-handling/memory-errors' target='_blank'>in the docs</a>",
						},
					);
					workflowError = new WorkflowOperationError(
						'Workflow did not finish, possible out-of-memory issue',
					);
					taskData.error = nodeError;
					taskData.executionStatus = 'crashed';
					executionData.resultData.lastNodeExecuted = nodeName;
					if (nodeStartedMessage) lastNodeRunTimestamp = nodeStartedMessage.ts;
				} else if (nodeStartedMessage && nodeFinishedMessage) {
					taskData.executionStatus = 'success';
					if (taskData.data === undefined) {
						taskData.data = {
							main: [
								[
									{
										json: {
											isArtificialRecoveredEventItem: true,
										},
										pairedItem: undefined,
									},
								],
							],
						};
					}
				}

				if (!executionData.resultData.runData[nodeName]) {
					executionData.resultData.runData[nodeName] = [taskData];
				}
			}

			if (!lastNodeRunTimestamp) {
				const workflowEndedMessage = messages.find((message) =>
					(
						[
							'flowease.workflow.success',
							'flowease.workflow.crashed',
							'flowease.workflow.failed',
						] as EventNamesTypes[]
					).includes(message.eventName),
				);
				if (workflowEndedMessage) {
					lastNodeRunTimestamp = workflowEndedMessage.ts;
				} else {
					if (!workflowError) {
						workflowError = new WorkflowOperationError(
							'Workflow did not finish, possible out-of-memory issue',
						);
					}
					const workflowStartedMessage = messages.find(
						(message) => message.eventName === 'flowease.workflow.started',
					);
					if (workflowStartedMessage) {
						lastNodeRunTimestamp = workflowStartedMessage.ts;
					}
				}
			}

			if (!executionData.resultData.error && workflowError) {
				executionData.resultData.error = workflowError;
			}

			if (applyToDb) {
				const newStatus = executionEntry.status === 'error' ? 'error' : 'crashed';
				await this.executionRepository.updateExistingExecution(executionId, {
					data: executionData,
					status: newStatus,
					stoppedAt: lastNodeRunTimestamp?.toJSDate(),
				});
				await Container.get(InternalHooks).onWorkflowPostExecute(
					executionId,
					executionEntry.workflowData,
					{
						data: executionData,
						finished: false,
						mode: executionEntry.mode,
						waitTill: executionEntry.waitTill ?? undefined,
						startedAt: executionEntry.startedAt,
						stoppedAt: lastNodeRunTimestamp?.toJSDate(),
						status: newStatus,
					},
				);
				const iRunData: IRun = {
					data: executionData,
					finished: false,
					mode: executionEntry.mode,
					waitTill: executionEntry.waitTill ?? undefined,
					startedAt: executionEntry.startedAt,
					stoppedAt: lastNodeRunTimestamp?.toJSDate(),
					status: newStatus,
				};
				const workflowHooks = getWorkflowHooksMain(
					{
						userId: '',
						workflowData: executionEntry.workflowData,
						executionMode: executionEntry.mode,
						executionData,
						runData: executionData.resultData.runData,
						retryOf: executionEntry.retryOf,
					},
					executionId,
				);

				// execute workflowExecuteAfter hook to trigger error workflow
				await workflowHooks.executeHookFunctions('workflowExecuteAfter', [iRunData]);

				// wait for UI to be back up and send the execution data
				this.push.once('editorUiConnected', async () => {
					// add a small timeout to make sure the UI is back up
					await sleep(1000);
					this.push.broadcast('executionRecovered', { executionId });
				});
			}
			return executionData;
		}
		return;
	}
}
