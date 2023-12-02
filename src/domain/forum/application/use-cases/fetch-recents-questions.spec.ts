import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchRecentsQuestionsUseCase } from './fetch-recents-questions'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-respository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let fetchRecentsQuestionsUseCase: FetchRecentsQuestionsUseCase

describe('Fetch Recents Question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository, inMemoryAttachmentsRepository, inMemoryStudentsRepository)
		fetchRecentsQuestionsUseCase = new FetchRecentsQuestionsUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to fetch recent questions', async () => {
		await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2023, 2, 19) }))
		await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2023, 4, 2) }))
		await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2023, 1, 29) }))

		const result = await fetchRecentsQuestionsUseCase.execute({
			page: 1,
		})

		expect(result.value?.questions).toEqual([
			expect.objectContaining({ createdAt: new Date(2023, 4, 2)}),
			expect.objectContaining({ createdAt: new Date(2023, 2, 19)}),
			expect.objectContaining({ createdAt: new Date(2023, 1, 29)}),
		])
	})

	it('should be able to fetch paginated recent questions', async () => {
		for(let i = 0; i < 22; i++) {
			await inMemoryQuestionsRepository.create(makeQuestion())
		}

		const result = await fetchRecentsQuestionsUseCase.execute({
			page: 2,
		})

		expect(result.value?.questions).toHaveLength(2)
	}) 
})
