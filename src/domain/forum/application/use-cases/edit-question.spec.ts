import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-respository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachments'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let editQuestionUseCase: EditQuestionUseCase

describe('Edit Question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
		editQuestionUseCase = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentsRepository)
	})

	it('should be able to edit a question', async () => {
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

		await editQuestionUseCase.execute({
			questionId: newQuestion.id.toString(),
			authorId: '4',
			title: 'Pergunta de teste',
			content: 'Coteúdo de teste',
			attachmentsIds: ['1', '3'],
		})
    
		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: 'Pergunta de teste',
			content: 'Coteúdo de teste'
		})

		expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
		expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		])
	})
    
	it('should not be able to edit a question from another user', async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityId('author-4'),
		}, new UniqueEntityId('1'))
		inMemoryQuestionsRepository.create(newQuestion)     

		const result = await editQuestionUseCase.execute({
			questionId: newQuestion.id.toString(),
			authorId: 'author-543543',
			title: 'Pergunta de teste',
			content: 'Coteúdo de teste',
			attachmentsIds: []
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})

	it('should sync new and removed attachment when editing a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		)

		await inMemoryQuestionsRepository.create(newQuestion)

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

		const result = await editQuestionUseCase.execute({
			questionId: newQuestion.id.toValue(),
			authorId: 'author-1',
			title: 'Pergunta teste',
			content: 'Conteúdo teste',
			attachmentsIds: ['1', '3'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
		expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityId('1'),
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId('3'),
				}),
			]),
		)
	})
})
