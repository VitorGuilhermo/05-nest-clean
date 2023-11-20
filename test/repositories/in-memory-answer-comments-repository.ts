import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
	public items: AnswerComment[] = []
    
	async create(answerComment: AnswerComment){
		this.items.push(answerComment)
	}

	async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = this.items.find(item => item.id.toString() === id)

		if(!answerComment) {
			return null
		}

		return answerComment
	}

	async findManyByAnswerId(answerId: string, { page }: PaginationParams){
		const comments = this.items
			.filter(item => item.answerId.toString() === answerId)
			.slice((page - 1) * 20, page * 20)

		return comments
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		const itemIndex = this.items.findIndex(item => item.id === answerComment.id)

		this.items.splice(itemIndex, 1)
	}
}