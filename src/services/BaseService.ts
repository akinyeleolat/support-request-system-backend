import { Document, Model} from 'mongoose';

export abstract class BaseService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount !== 0;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findBy(conditions: object): Promise<T | null> {
    return this.model.findOne(conditions);
  }

  async findAll(filter?: object): Promise<T[]> {
    return this.model.find(filter || {});
  }
}
