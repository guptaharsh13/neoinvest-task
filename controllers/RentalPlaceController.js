const db = require("../models");
const RentalPlace = db.rentalPlaces;
const Op = db.Sequelize.Op;

const correctDate = (input) => {
  const d = new Date(input);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
};

const add = (req, res) => {
  const { address, startDate, endDate, guests } = req.body;
  let errors = [];

  // Validate fields
  if (!address || !startDate || !endDate || !guests) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (errors.length > 0) {
    res.status(400).json({
      errors,
    });
  } else {
    // Validation passed
    const newRentalPlace = {
      address,
      startDate: correctDate(startDate),
      endDate: correctDate(endDate),
      guests,
    };

    // Save rental place
    RentalPlace.create(newRentalPlace)
      .then((rentalPlace) => {
        res.json({
          message: "Rental Place added successfully",
          rentalPlaceId: rentalPlace.id,
        });
      })
      .catch((err) => console.log(err));
  }
};

const search = (req, res) => {
  const { startDate, endDate, guests } = req.query;
  let errors = [];

  // Validate fields
  if (!startDate || !endDate || !guests) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (errors.length > 0) {
    res.status(400).json({
      errors,
    });
  } else {
    // Validation passed
    RentalPlace.findAll({
      where: {
        startDate: { [Op.lte]: correctDate(startDate) },
        endDate: { [Op.gte]: correctDate(endDate) },
        guests: { [Op.gte]: guests },
      },
    })
      .then((rentalPlaces) => {
        res.json({
          message: "Rental Place fetched successfully",
          data: rentalPlaces,
        });
      })
      .catch((err) => console.log(err));
  }
};

// Get Single Rental Place details using ID
const findById = (req, res) => {
  const { id } = req.params;
  let errors = [];

  // Validate fields
  if (!id) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (errors.length > 0) {
    res.status(400).json({
      errors,
    });
  } else {
    // Validation passed
    RentalPlace.findByPk(id)
      .then((rentalPlace) => {
        res.json({
          message: "Rental Place fetched successfully",
          data: rentalPlace,
        });
      })
      .catch((err) => console.log(err));
  }
};

module.exports = {
  add,
  search,
  findById,
};
