import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository,
		fetchAnswerCommentsUseCase = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
	})

	it('should be able to fetch answer comments', async () => {
		await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
			answerId: new UniqueEntityId('1')
		}))
		await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
			answerId: new UniqueEntityId('1')
		}))
		await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
			answerId: new UniqueEntityId('1')
		}))

		const result = await fetchAnswerCommentsUseCase.execute({
			answerId: '1',
			page: 1
		})

		expect(result.value?.comments).toHaveLength(3)
	})

	it('should be able to fetch paginated answer comments', async () => {
		for(let i = 0; i < 22; i++) {
			await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
				answerId: new UniqueEntityId('1')
			}))
		}

		const result = await fetchAnswerCommentsUseCase.execute({
			answerId: '1',
			page: 2,
		})

		expect(result.value?.comments).toHaveLength(2)
	}) 
})
