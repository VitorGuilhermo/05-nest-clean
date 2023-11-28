import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface EditAnswerUseCaseRequest {
    answerId: string
    authorId: string
    content: string
    attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { answer: Answer }>


@Injectable()
export class EditAnswerUseCase {
	private answersRepository: AnswersRepository
	private answerAttachmentsRepository: AnswerAttachmentsRepository

	constructor(answersRepository: AnswersRepository, answerAttachmentsRepository: AnswerAttachmentsRepository) { 
		this.answersRepository = answersRepository
		this.answerAttachmentsRepository = answerAttachmentsRepository
	}


	async execute({ answerId, authorId, content, attachmentsIds }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId)

		if(!answer) {
			return left(new ResourceNotFoundError())
		}

		if(authorId !== answer.authorId.toString()) {
			return left(new NotAllowedError())
		}

		const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

		const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)

		const answerAttachments = attachmentsIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			})
		})

		answerAttachmentList.update(answerAttachments)

		answer.attachments = answerAttachmentList
		answer.content = content

		await this.answersRepository.save(answer)

		return right({
			answer
		})
	}
}