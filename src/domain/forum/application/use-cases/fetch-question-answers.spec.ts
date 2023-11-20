import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-respository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
		fetchQuestionAnswersUseCase = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
	})

	it('should be able to fetch question answers', async () => {
		await inMemoryAnswersRepository.create(makeAnswer({
			questionId: new UniqueEntityId('1')
		}))
		await inMemoryAnswersRepository.create(makeAnswer({
			questionId: new UniqueEntityId('1')
		}))
		await inMemoryAnswersRepository.create(makeAnswer({
			questionId: new UniqueEntityId('1')
		}))

		const result = await fetchQuestionAnswersUseCase.execute({
			questionId: '1',
			page: 1
		})

		expect(result.value?.answers).toHaveLength(3)
	})

	it('should be able to fetch paginated question answers', async () => {
		for(let i = 0; i < 22; i++) {
			await inMemoryAnswersRepository.create(makeAnswer({
				questionId: new UniqueEntityId('1')
			}))
		}

		const result = await fetchQuestionAnswersUseCase.execute({
			questionId: '1',
			page: 2,
		})

		expect(result.value?.answers).toHaveLength(2)
	}) 
})
