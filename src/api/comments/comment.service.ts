import { Repository } from 'typeorm';
import AppDataSource from '../../database/data-source';
import { CustomError } from '../../util/custom-error';
import { Memo } from '../memos/memo.entity';
import { findMemoById } from '../memos/memo.service';
import { findUserByUsername } from '../users/user.service';
import { Comment } from './coment.entity';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { ResponseCommentDTO } from './dtos/response-comment.dto';
import { UpdateCommentDTO } from './dtos/update-comment.dto';

const commentRepository: Repository<Comment> = AppDataSource.getRepository(Comment);

const findCommentById = async (id: number): Promise<Comment> => {
  try {
    const comment = await commentRepository.findOne({ where: { id: id }, relations: ['createdBy'] });
    if (comment == null) throw new CustomError(404, `Comment with id ${id} not found`);
    return comment;
  } catch (err) {
    throw err;
  }
};

const checkCreator = async (comment: Comment, username: string): Promise<boolean> => {
  const user = await findUserByUsername(username);
  if (comment.createdBy.username === user.username) return true;
  return false;
};

export const getComments = async (memo: Memo): Promise<ResponseCommentDTO[]> => {
  const comments = await commentRepository.find({
    where: { memo: { id: memo.id } },
    relations: ['createdBy'],
    order: { createdAt: 'ASC' },
  });
  return comments.map((comment) => Comment.toDTO(comment));
};

export const createComment = async (
  createCommentDTO: CreateCommentDTO,
  username: string
): Promise<ResponseCommentDTO> => {
  const memo = await findMemoById(createCommentDTO.memoId);
  const user = await findUserByUsername(username);
  try {
    const commentEntity = CreateCommentDTO.toEntity(createCommentDTO, memo, user);
    const createdComment = await commentRepository.save(commentEntity);
    return Comment.toDTO(createdComment);
  } catch (err) {
    throw new CustomError(500, 'Internal server error');
  }
};

export const updateComment = async (
  id: number,
  updateCommentDTO: UpdateCommentDTO,
  username: string
): Promise<ResponseCommentDTO> => {
  const comment = await findCommentById(id);
  const matchingCreator = await checkCreator(comment, username);
  if (!matchingCreator) throw new CustomError(403, 'Update only allowed to the creator');

  try {
    if (updateCommentDTO.content != undefined) comment.content = updateCommentDTO.content;
    const updatedMemo = await commentRepository.save(comment);
    return Comment.toDTO(updatedMemo);
  } catch (err) {
    throw new CustomError(500, 'Internal server error');
  }
};

export const deleteComment = async (id: number, username: string): Promise<ResponseCommentDTO> => {
  const comment = await findCommentById(id);
  const matchingCreator = await checkCreator(comment, username);
  if (!matchingCreator) throw new CustomError(403, 'Deletion only allowed to the creator');

  try {
    const result = await commentRepository.remove(comment);
    return Comment.toDTO(result);
  } catch (err) {
    throw new CustomError(500, 'Internal server error');
  }
};
