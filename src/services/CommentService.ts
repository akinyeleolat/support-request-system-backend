// src/services/CommentService.ts
import CommentModel, { CommentDocument } from '../models/Comment';

export class CommentService {
  private commentModel: CommentModel;

  constructor(commentModel: CommentModel) {
    this.commentModel = commentModel;
  }

  async create(data: Partial<CommentDocument>) {
    return this.commentModel.create(data);
  }

  async update(id: string, data: Partial<CommentDocument>) {
    return this.commentModel.update(id, data);
  }

  async delete(id: string) {
    return this.commentModel.delete(id);
  }

  async findAll(filter?: object) {
    return this.commentModel.findAll(filter);
  }
}
