import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository)
		deleteQuestionCommentUseCase = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
	})

	it('should not be able to delete another user question comment', async () => {
		const newQuestionComment = makeQuestionComment({
			authorId: new UniqueEntityId('1')
		})

		inMemoryQuestionCommentsRepository.create(newQuestionComment)

		const result = await deleteQuestionCommentUseCase.execute({
			questionCommentId: newQuestionComment.id.toString(),
			authorId: '22',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})

	it('should be able to delete a question comment', async () => {
		const newQuestionComment = makeQuestionComment()

		inMemoryQuestionCommentsRepository.create(newQuestionComment)

		await deleteQuestionCommentUseCase.execute({
			questionCommentId: newQuestionComment.id.toString(),
			authorId: newQuestionComment.authorId.toString(),
		})
    
		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
	})
})
