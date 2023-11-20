import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-respository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeQuestionAttachment } from 'test/factories/make-question-attachments'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let deleteQuestionUseCase: DeleteQuestionUseCase

describe('Delete Question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
		deleteQuestionUseCase = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to delete a question', async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityId('4'),
		}, new UniqueEntityId('1'))
		inMemoryQuestionsRepository.create(newQuestion)     

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		)

		await deleteQuestionUseCase.execute({
			questionId: '1',
			authorId: '4' 
		})
    
		expect(inMemoryQuestionsRepository.items).toHaveLength(0)
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
	})
    
	it('should not be able to delete a question from another user', async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityId('author-4'),
		}, new UniqueEntityId('1'))
		inMemoryQuestionsRepository.create(newQuestion)     

		const result = await deleteQuestionUseCase.execute({
			questionId: '1',
			authorId: 'author-55555' 
		})
        
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})  
})
