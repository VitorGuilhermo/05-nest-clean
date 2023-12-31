import { Injectable } from '@nestjs/common'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface ChooseQuestionBestAnswerUseCaseRequest {
    authorId: string
    answerId:  string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { question: Question }>


@Injectable()
export class ChooseQuestionBestAnswerUseCase {
	private answersRepository: AnswersRepository
	private questionsRepository: QuestionsRepository

	constructor(answersRepository: AnswersRepository, questionsRepository: QuestionsRepository) { 
		this.answersRepository = answersRepository
		this.questionsRepository = questionsRepository
	}


	async execute({ authorId, answerId }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId)

		if(!answer) {
			return left(new ResourceNotFoundError())
		}

		const question = await this.questionsRepository.findById(answer.questionId.toString())

		if(!question) {
			return left(new ResourceNotFoundError())
		}

		if(authorId !== question.authorId.toString()) {
			return left(new NotAllowedError())
		}

		question.bestAnswerId = answer.id

		await this.questionsRepository.save(question)

		return right({ 
			question,
		})
	}
}