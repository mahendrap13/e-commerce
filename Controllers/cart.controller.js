import cartModel from "../Models/cart.Model";
import productsModel from "../Models/products.Model";

export const addCart = async (req, res) => {
  try {
    const { userID, productID } = req.body;
    const cartData = await cartModel.findOne({
      userID: userID,
      productID: productID,
    });
    if (cartData) {
      if (cartData.quantity >= 10) {
        return res.status(400).json({
          message: "You have reached the limit of 10 products in your cart",
        });
      }
      if (cartData) {
        const updateCart = await cartModel.updateOne(
          { userID: userID, productID: productID },
          {
            $set: {
              quantity: cartData.quantity + 1,
            },
          }
        );
        if (updateCart) {
          return res.status(200).json({
            message: "Again Added to cart",
          });
        }
      }
    } else {
      const productData = await productsModel.findOne({ _id: productID });
      const newCart = new cartModel({
        name: productData.name,
        price: productData.price,
        image: productData.thumbnail,
        userID: userID,
        productID: productID,
        quantity: 1,
      });
      newCart.save();
      if (newCart) {
        return res.status(200).json({
          data: newCart,
          message: "Added to cart",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cartData = await cartModel.find();
    if (cartData) {
      return res.status(200).json({
        data: cartData,
        message: "Cart Data",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const ID = req.params.cart_id;
    const deleteCart = await cartModel.deleteOne({ _id: ID });
    if (deleteCart.acknowledged) {
      return res.status(200).json({
        data: deleteCart,
        message: "Deleted product from cart",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const cartID = req.params.cart_id;
    const { type } = req.query;
    const cartItem = await cartModel.findOne({ _id: cartID });
    if (cartItem.quantity >= 10 && type === "inc") {
      return res.status(400).json({
        message: "You have reached the limit of 10 products in your cart",
      });
    }
    if (cartItem.quantity <= 1 && type === "dec") {
      const deleteCart = await cartModel.deleteOne({ _id: cartID });
      if (deleteCart) {
        return res.status(400).json({
          message: " Cart Item Deleted",
        });
      }
    }
    let quantity = cartItem.quantity;
    if (type === "inc") {
      quantity = quantity + 1;
    } else if (type === "dec") {
      quantity = quantity - 1;
    }
    const updateCart = await cartModel.updateOne(
      { _id: cartID },
      {
        $set: { quantity: quantity },
      }
    );
    if (updateCart) {
      return res.status(200).json({
        message: "Cart Updated",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
