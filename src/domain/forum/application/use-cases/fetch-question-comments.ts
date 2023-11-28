import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'

interface FetchQuestionCommentsUseCaseRequest {
    questionId: string
    page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<null, { comments: QuestionComment[] }>


@Injectable()
export class FetchQuestionCommentsUseCase {
	private questionCommentsRepository: QuestionCommentsRepository

	constructor(questionCommentsRepository: QuestionCommentsRepository) { 
		this.questionCommentsRepository = questionCommentsRepository
	}

    
	async execute({ questionId, page }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const comments = await this.questionCommentsRepository.findManyByQuestionId(questionId, { page })

		return right({
			comments
		})
	}
}