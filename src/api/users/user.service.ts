import { User } from './user.entity';
import AppDataSource from '../../database/data-source';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import { CustomError } from '../../util/custom-error';
import { ResponseUserDTO } from './dtos/response-user.dto';
import { LoginUserDTO } from './dtos/login-user.dto';
import { generateToken } from '../../util/jwt';

const userRepository: Repository<User> = AppDataSource.getRepository(User);

const checkUnique = async (username: string): Promise<boolean> => {
  try {
    await userRepository.findOneByOrFail({ username: username });
    return false;
  } catch (err) {
    return true;
  }
};

export const findUserByUsername = async (username: string): Promise<User> => {
  try {
    const user = await userRepository.findOneByOrFail({ username: username });
    return user;
  } catch (err) {
    throw new CustomError(404, `User ${username} not found`);
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

export const login = async (loginUserDTO: LoginUserDTO): Promise<string> => {
  const user = await findUserByUsername(loginUserDTO.username);
  try {
    const passwordMatch = await User.comparePassword(loginUserDTO.password, user.password);
    if (!passwordMatch) throw new CustomError(401, 'Password does not match');

    const token = await generateToken(user.username);
    return String(token);
  } catch (err) {
    throw err;
  }
};
