'use strict';

const t = require('tcomb');
const {PositiveFloat, PositiveInteger} = require('../../utils/types');

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

const commands = {
  CreateOrder: t.struct({
    user: User,
    products: t.list(Product)
  })
};

module.exports = {
  User,
  Product,
  Price,
  commands
};