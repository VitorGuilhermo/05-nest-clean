import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface AnswerQuestionUseCaseRequest {
    instructorId: string
    questionId:  string
    content: string
    attachmentsIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>


export class AnswerQuestionUseCase {
	private answersRepositoy: AnswersRepository

	constructor(answersRepository: AnswersRepository) { 
		this.answersRepositoy = answersRepository
	}


	async execute({ instructorId, questionId, content, attachmentsIds }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({ 
			content, 
			authorId: new UniqueEntityId(instructorId), 
			questionId: new UniqueEntityId(questionId)
		})

		const answerAttachments = attachmentsIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			})
		})

		answer.attachments = new AnswerAttachmentList(answerAttachments)

		await this.answersRepositoy.create(answer)

		return right({ 
			answer,
		})
	}
}