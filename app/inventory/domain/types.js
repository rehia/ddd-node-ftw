'use strict';

const t = require('tcomb');
const {PositiveInteger, CommandWithId} = require('../../utils/types');

const Product = t.struct({
  id: t.String,
});

const ProductInventory = t.struct({
  product: Product,
  remainingQuantity: t.Integer
});

const InventoryCommand = CommandWithId.extend(t.struct({
  quantity: PositiveInteger
}));

const commands = {
  FillProductInventory: InventoryCommand,
  WithdrawProductInventory: InventoryCommand,
};

module.exports = {
  Product,
  ProductInventory,
  commands
};