import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, isValidObjectId } from 'mongoose';
import { Book } from './schemas/book.schema';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: Model<Book>,
  ) {}

  async findAll(query: { keyword?: string; page?: string }): Promise<Book[]> {
    const resPerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const filter: FilterQuery<Book> = {};

    if (query.keyword) {
      filter.title = { $regex: query.keyword, $options: 'i' };
    }

    const books = await this.bookModel
      .find(filter)
      .limit(resPerPage)
      .skip(skip);

    return books;
  }

  async create(book: Book, user: User): Promise<Book> {
    const newBook = Object.assign(book, { user: user._id });
    const res = await this.bookModel.create(newBook);
    return res;
  }

  async findById(id: string): Promise<Book> {
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id');
    }

    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }

  async updateById(id: string, book: Book): Promise<Book> {
    const res = await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });

    return res;
  }

  async deleteById(id: string): Promise<Book> {
    const res = await this.bookModel.findByIdAndDelete(id);

    return res;
  }
}
