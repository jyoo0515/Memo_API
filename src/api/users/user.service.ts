import { User } from './user.entity';
import AppDataSource from '../../database/data-source';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import { CustomError } from '../../util/custom-error';
import { ResponseUserDTO } from './dtos/response-user.dto';

const userRepository: Repository<User> = AppDataSource.getRepository(User);

const checkUnique = async (username: string): Promise<boolean> => {
  try {
    await userRepository.findOneByOrFail({ username: username });
    return false;
  } catch (err) {
    return true;
  }
};

export const register = async (createUserDTO: CreateUserDTO): Promise<ResponseUserDTO> => {
  const unique = await checkUnique(createUserDTO.username);
  if (!unique) throw new CustomError(400, `User ${createUserDTO.username} already exists`);
  try {
    const user = await userRepository.create(createUserDTO);
    const result = await userRepository.save(user);
    return User.toDTO(result);
  } catch (err) {
    throw new CustomError(500, 'Internal server error');
  }
};
