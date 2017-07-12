'use strict';

const t = require('tcomb');
const {PositiveFloat, PositiveInteger} = require('../../utils/types');

const Address = t.struct({
  street: t.String,
  zipCode: t.String,
  city: t.String,
  country: t.String
});

const Supplier = t.struct({
  name: t.String,
  address: Address
});

const Price = t.struct({
  excludingTaxes: PositiveFloat,
  currency: t.String,
  vat: PositiveFloat
});

const Product = t.struct({
  id: t.String,
  reference: t.String,
  quantity: PositiveInteger,
  price: Price
});

const Purchase = t.struct({
  id: t.String,
  supplier: Supplier,
  products: t.list(Product)
});

const commands = {
  PurchaseProducts: t.interface({
    supplier: Supplier,
    products: t.list(Product)
  }),
};

module.exports = {
  Supplier,
  Product,
  Price,
  Purchase,
  commands
};