module.exports = (sequelize, Sequelize) => {
  const RentalPlace = sequelize.define("rentalPlace", {
    address: {
      type: Sequelize.STRING,
    },
    startDate: {
      type: Sequelize.DATE,
    },
    endDate: {
      type: Sequelize.DATE,
    },
    guests: {
      type: Sequelize.INTEGER,
    },
  });

  return RentalPlace;
};
