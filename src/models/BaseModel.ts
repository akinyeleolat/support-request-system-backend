// src/models/BaseModel.ts
import { Document, FilterQuery, Model } from 'mongoose';

export interface BaseModel<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  save(data: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<T | null>;
  findBy(filter: FilterQuery<T>): Promise<T | null>;
  findAll(filter?: FilterQuery<T>): Promise<T[]>;
}

export abstract class BaseMongooseModel<T extends Document> implements BaseModel<T> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async save(data: T): Promise<T> {
    return data.save();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const document = await this.model.findByIdAndUpdate(id, data, { new: true });
    return document ? document : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findBy(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async findAll(filter?: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter || {});
  }
}
