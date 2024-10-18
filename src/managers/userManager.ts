import User from '../models/userModel';

const createUser = async (
  email: string,
  hashedPassword: string,
  displayName: string
) => {
  return User.create({
    email,
    password: hashedPassword,
    displayName,
  });
};

const findByEmail = async (email: string) => {
  return User.findOne({ where: { email } });
};

const findById = async (userId: number) => {
  return User.findByPk(userId);
};

const getAllUsers = async () => {
  return User.findAll({
    attributes: ['id', 'displayName'],
  });
};

export const userManager = {
  createUser,
  findByEmail,
  findById,
  getAllUsers,
};
