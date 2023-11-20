import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository,
		fetchQuestionCommentsUseCase = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
	})

	it('should be able to fetch question comments', async () => {
		await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
			questionId: new UniqueEntityId('1')
		}))
		await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
			questionId: new UniqueEntityId('1')
		}))
		await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
			questionId: new UniqueEntityId('1')
		}))

		const result = await fetchQuestionCommentsUseCase.execute({
			questionId: '1',
			page: 1
		})

		expect(result.value?.comments).toHaveLength(3)
	})

	it('should be able to fetch paginated question comments', async () => {
		for(let i = 0; i < 22; i++) {
			await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
				questionId: new UniqueEntityId('1')
			}))
		}

		const result = await fetchQuestionCommentsUseCase.execute({
			questionId: '1',
			page: 2,
		})

		expect(result.value?.comments).toHaveLength(2)
	}) 
})
