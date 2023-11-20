import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
    answerId: string
    page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<null, { comments: AnswerComment[] }>

export class FetchAnswerCommentsUseCase {
	private answerCommentsRepository: AnswerCommentsRepository

	constructor(answerCommentsRepository: AnswerCommentsRepository) { 
		this.answerCommentsRepository = answerCommentsRepository
	}

    
	async execute({ answerId, page }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const comments = await this.answerCommentsRepository.findManyByAnswerId(answerId, { page })

		return right({
			comments
		})
	}
}