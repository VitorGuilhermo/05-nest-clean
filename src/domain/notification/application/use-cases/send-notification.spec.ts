import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

describe('Send Notification', () => {
	beforeEach(() => {
		inMemoryNotificationRepository = new InMemoryNotificationsRepository()
		sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationRepository)
	})

	it('should be able to send a notification', async () => {
		const result = await sendNotificationUseCase.execute({
			recipientId: '1',
			title: 'Nova notificação',
			content: 'Conteúdo da notificação'
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryNotificationRepository.items[0]).toEqual(result.value?.notification)
	})
})
