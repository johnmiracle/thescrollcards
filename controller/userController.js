const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Cart = require("../models/cart");

exports.order_page = (req, res, next) => {
  Order.find({ user: req.user }, (err, orders) => {
    if (err) {
      res.flash("danger", "Error loading order, Please try again");
      res.redirect("/users/orders");
      return;
    } else {
      let orderProducts;
      orders.forEach(function(order) {
        orderProducts = new Cart(order.orderProducts);
        order.items = orderProducts.generateArray();
      });
      res.render("orders_page", { orders });
    }
  });
};

exports.view_order = async (req, res, next) => {
  const result = await Order.findById(req.params.id);

  Order.find({ _id: req.params.id }, function(err, orders) {
    let data = [];
    data.length = 0;
    orders.forEach(function(order) {
      const orderProducts = new Cart(order.orderProducts);
      order.item = orderProducts.generateArray();
      data = order.item;
      console.log(data);
    });
    res.render("order", { result, orders: data });
  });
};
