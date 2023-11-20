import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface DeleteQuestionUseCaseRequest {
    questionId: string
    authorId: string
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null>

export class DeleteQuestionUseCase {
	private questionsRepository: QuestionsRepository

	constructor(questionsRepository: QuestionsRepository) { 
		this.questionsRepository = questionsRepository
	}


	async execute({ questionId, authorId }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId)

		if(!question) {
			return left(new ResourceNotFoundError())
		}

		if(authorId !== question.authorId.toString()) {
			return left(new NotAllowedError())
		}

		await this.questionsRepository.delete(question)

		return right(null)
	}
}