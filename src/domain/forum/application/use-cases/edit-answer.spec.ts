import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-respository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachments'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let editAnswerUseCase: EditAnswerUseCase

describe('Edit Answer', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
		editAnswerUseCase = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository)
	})

	it('should be able to edit a answer', async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityId('4'),
		}, new UniqueEntityId('1'))
		inMemoryAnswersRepository.create(newAnswer)     

		inMemoryAnswerAttachmentsRepository.items.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		)

		await editAnswerUseCase.execute({
			answerId: newAnswer.id.toString(),
			authorId: '4',
			content: 'Coteúdo de teste',
			attachmentsIds: ['1', '3'],
		})

		expect(inMemoryAnswersRepository.items[0]).toMatchObject({
			content: 'Coteúdo de teste'
		})

		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		])
	})
    
	it('should not be able to edit a answer from another user', async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityId('author-4'),
		}, new UniqueEntityId('1'))
		inMemoryAnswersRepository.create(newAnswer)     

		const result = await editAnswerUseCase.execute({
			answerId: newAnswer.id.toString(),
			authorId: 'author-543543',
			content: 'Coteúdo de teste',
			attachmentsIds: []
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})  
})
