import Product from './product.model';

export async function createProduct(req, res) {
  try {
    const { name, description, category, price, restaurant } = req.body;
    const newProduct = new Product({ name, description, category, price, restaurant });
    const result = await newProduct.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findOne({ _id: req.params.id, active: true });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found or inactive' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function getProducts(req, res) {
  try {
    const { category, restaurant } = req.query;
    const query = { active: true };

    if (category) query.category = category;
    if (restaurant) query.restaurant = restaurant;

    const products = await Product.aggregate([
      { $match: query },
      { $sort: { category: 1 } },
      {
        $group: {
          _id: '$category',
          products: { $push: '$$ROOT' },
        },
      },
    ]);

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await Product.findOne({ _id: req.params.id, active: true });
    if (!product) {
      res.status(404).json({ message: 'Product not found or inactive' });
      return;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findOne({ _id: req.params.id, active: true });
    if (!product) {
      res.status(404).json({ message: 'Product not found or inactive' });
      return;
    }

    const deletedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (deletedProduct) {
      res.status(200).json({ message: 'Product disabled' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}
