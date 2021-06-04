/* eslint-disable class-methods-use-this */
class UserMapper {
  toDto(user) {
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      password: user.password,
      userableType: user.userable_type,
      userableId: user.userable_id,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      deletedAt: user.deleted_at,
    };
  }

  toDatabaseEntity(userDto) {
    const userDbEntity = {
      id: userDto.id,
      first_name: userDto.firstName,
      last_name: userDto.lastName,
      email: userDto.email,
      password: userDto.password,
      userable_type: userDto.userableType,
      userable_id: userDto.userableId,
    };

    Object.keys(userDbEntity).forEach(
      (key) => userDbEntity[key] === undefined && delete userDbEntity[key],
    );

    return userDbEntity;
  }
}

module.exports = UserMapper;