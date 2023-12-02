import { Either, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

interface FetchAnswerCommentsUseCaseRequest {
    answerId: string
    page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<null, { comments: CommentWithAuthor[] }>


@Injectable()
export class FetchAnswerCommentsUseCase {
	private answerCommentsRepository: AnswerCommentsRepository

	constructor(answerCommentsRepository: AnswerCommentsRepository) { 
		this.answerCommentsRepository = answerCommentsRepository
	}

    
	async execute({ answerId, page }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const comments = await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(answerId, { page })

		return right({
			comments
		})
	}
}