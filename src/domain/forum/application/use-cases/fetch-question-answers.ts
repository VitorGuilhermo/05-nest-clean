import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersUseCaseRequest {
    questionId: string
    page: number
}

type FetchQuestionAnswersUseCaseResponse = Either<null, { answers: Answer[] }>

export class FetchQuestionAnswersUseCase {
	private answersRepository: AnswersRepository

	constructor(answersRepository: AnswersRepository) { 
		this.answersRepository = answersRepository
	}

    
	async execute({ questionId, page }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
		const answers = await this.answersRepository.findManyByQuestionId(questionId, { page })

		return right({
			answers
		})
	}
}