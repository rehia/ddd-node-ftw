'use strict';

const t = require('tcomb');
const {PositiveFloat, PositiveInteger, CommandWithId} = require('../../utils/types');

const User = t.String;

const Price = t.struct({
  excludingTaxes: PositiveFloat,
  currency: t.String,
  vat: PositiveFloat
});

const Product = t.struct({
  id: t.String,
  quantity: PositiveInteger,
  price: Price
});

const OrderStatus = t.enums.of(['created', 'validated', 'canceled'], 'OrderStatus');

const Order = t.struct({
  id: t.String,
  user: User,
  products: t.list(Product),
  status: OrderStatus
});

const commands = {
  CreateOrder: t.struct({
    user: User,
    products: t.list(Product)
  }),

  ValidateOrder: CommandWithId
};

module.exports = {
  User,
  Product,
  Price,
  Order,
  commands
};