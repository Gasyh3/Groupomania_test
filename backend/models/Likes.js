module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes");

  Likes.associate = (models) => {
    Likes.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
    });
    Likes.belongsTo(models.Posts, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
    });
  };
  return Likes;
};
