import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
		deleteAnswerCommentUseCase = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
	})

	it('should not be able to delete another user answer comment', async () => {
		const newAnswerComment = makeAnswerComment({
			authorId: new UniqueEntityId('1')
		})

		inMemoryAnswerCommentsRepository.create(newAnswerComment)

		const result = await deleteAnswerCommentUseCase.execute({
			answerCommentId: newAnswerComment.id.toString(),
			authorId: '22',
		})
        
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})

	it('should be able to delete a answer comment', async () => {
		const newAnswerComment = makeAnswerComment()

		inMemoryAnswerCommentsRepository.create(newAnswerComment)

		await deleteAnswerCommentUseCase.execute({
			answerCommentId: newAnswerComment.id.toString(),
			authorId: newAnswerComment.authorId.toString(),
		})
    
		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
	})
})
