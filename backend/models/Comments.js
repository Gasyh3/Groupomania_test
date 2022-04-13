module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    commentBody: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
    });
    Comments.belongsTo(models.Posts, {
      foreignKey: {
        allowNull: false,
      },
      onDelete: "cascade",
    });
  };
  return Comments;
};
