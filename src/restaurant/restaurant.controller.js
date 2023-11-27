import addressModel from '../address/address.model';
import Restaurant from './restaurant.model';
import Order from '../order/order.model';

export async function createRestaurant(req, res) {
  try {
    const { name, category, description, address } = req.body;

    if (!address) {
      res.status(400).json({ message: 'Address is required' });
    }

    const newRestaurant = new Restaurant({ name, description, category });
    const savedRestaurant = await newRestaurant.save();

    const newAddress = new addressModel({ ...address });
    const savedAddress = await newAddress.save();

    savedRestaurant.address = savedAddress._id;
    await savedRestaurant.save();

    res.status(201).json(savedRestaurant);
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function getRestaurantById(req, res) {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant && restaurant.active) {
      res.status(200).json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found or inactive' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function getRestaurants(req, res) {
  try {
    const { category, name } = req.query;
    const query = { active: true };

    if (category) query.category = category;
    if (name) query.name = { $regex: new RegExp(name, 'i') };

    let restaurants = await Restaurant.find(query);

    const calculatePopularity = async (restaurant) => {
      const completedOrdersCount = await Order.countDocuments({
        restaurant: restaurant._id,
        status: 'completed',
      });
      restaurant._doc.popularity = completedOrdersCount;
      return restaurant;
    };

    const restaurantsWithPopularity = await Promise.all(
      restaurants.map((restaurant) => calculatePopularity(restaurant))
    );

    restaurantsWithPopularity.sort((a, b) => b._doc.popularity - a._doc.popularity);

    res.status(200).json(restaurantsWithPopularity);
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function updateRestaurant(req, res) {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant || !restaurant.active) {
      res.status(404).json({ message: 'Restaurant not found or inactive' });
      return;
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedRestaurant);
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function deleteRestaurant(req, res) {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant || !restaurant.active) {
      res.status(404).json({ message: 'Restaurant not found or inactive' });
      return;
    }

    const deletedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    res.status(200).json({ message: 'Restaurant disabled' });
  } catch (err) {
    res.status(500).json(err);
  }
}
