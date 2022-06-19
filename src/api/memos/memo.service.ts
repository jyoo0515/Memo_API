import { Memo } from './memo.entity';
import AppDataSource from '../../database/data-source';
import { Repository } from 'typeorm';
import { CreateMemoDTO } from './dtos/create-memo.dto';
import { ResponseMemoDTO } from './dtos/response-memo.dto';
import { CustomError } from '../../util/custom-error';
import { UpdateMemoDTO } from './dtos/update-memo.dto';
import { findUserByUsername } from '../users/user.service';

const memoRepository: Repository<Memo> = AppDataSource.getRepository(Memo);

const findOneById = async (id: number): Promise<Memo> => {
  try {
    const memo = await memoRepository.findOne({ where: { id: id }, relations: ['createdBy'] });
    if (memo == null) throw new CustomError(404, `Memo with id ${id} not found`);
    return memo;
  } catch (err) {
    throw err;
  }
};

const checkCreator = async (memo: Memo, username: string): Promise<boolean> => {
  const user = await findUserByUsername(username);
  if (memo.createdBy.username === user.username) return true;
  return false;
};

export const getAllMemos = async (): Promise<ResponseMemoDTO[]> => {
  try {
    const memos = await memoRepository.find({ relations: ['createdBy'] });
    return memos.map((memo) => Memo.toDTO(memo));
  } catch (err) {
    throw new CustomError(500, 'Internal server error');
  }
};

export const getOneMemo = async (id: number): Promise<ResponseMemoDTO> => {
  const memo = await findOneById(id);
  return Memo.toDTO(memo);
};

export const createMemo = async (createMemoDTO: CreateMemoDTO, username: string): Promise<ResponseMemoDTO> => {
  const user = await findUserByUsername(username);
  try {
    const memoEntity = CreateMemoDTO.toEntity(createMemoDTO, user);
    const createdMemo = await memoRepository.save(memoEntity);
    return Memo.toDTO(createdMemo);
  } catch (err) {
    throw new CustomError(500, 'Internal server error');
  }
};

export const updateMemo = async (
  id: number,
  updateMemoDTO: UpdateMemoDTO,
  username: string
): Promise<ResponseMemoDTO> => {
  const memo = await findOneById(id);
  const matchingCreator = await checkCreator(memo, username);
  if (!matchingCreator) throw new CustomError(403, 'Update only allowed to the creator');

  try {
    if (updateMemoDTO.title != undefined) memo.title = updateMemoDTO.title;
    if (updateMemoDTO.content != undefined) memo.content = updateMemoDTO.content;
    const updatedMemo = await memoRepository.save(memo);
    return Memo.toDTO(updatedMemo);
  } catch (err) {
    throw new CustomError(500, 'Internal server error');
  }
};

export const deleteMemo = async (id: number, username: string): Promise<ResponseMemoDTO> => {
  const memo = await findOneById(id);
  const matchingCreator = await checkCreator(memo, username);
  if (!matchingCreator) throw new CustomError(403, 'Deletion only allowed to the creator');

  try {
    const result = await memoRepository.remove(memo);
    return Memo.toDTO(result);
  } catch (err) {
    throw new CustomError(500, 'Internal server error');
  }
};
