import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-respository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachments'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let deleteAnswerUseCase: DeleteAnswerUseCase

describe('Delete Answer', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
		deleteAnswerUseCase = new DeleteAnswerUseCase(inMemoryAnswersRepository)
	})

	it('should be able to delete a answer', async () => {
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

		await deleteAnswerUseCase.execute({
			answerId: '1',
			authorId: '4' 
		})
    
		expect(inMemoryAnswersRepository.items).toHaveLength(0)
		expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
	})
    
	it('should not be able to delete a answer from another user', async () => {
		const newAnswer = makeAnswer({
			authorId: new UniqueEntityId('author-4'),
		}, new UniqueEntityId('1'))
		inMemoryAnswersRepository.create(newAnswer)     

		const result = await deleteAnswerUseCase.execute({
			answerId: '1',
			authorId: 'author-55555' 
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})  
})
