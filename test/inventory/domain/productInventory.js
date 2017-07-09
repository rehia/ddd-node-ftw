/*eslint no-unused-vars:0 */
'use strict';

const {expect} = require('chai');

const productInventoryAggregate = require('../../../app/inventory/domain/productInventory');
const eventTypes = require('../../../app/inventory/domain/eventTypes');

describe('product inventory aggregate behavior', () => {
  const id = '1753O713';

  describe('reload aggregate', () => {
    it('should reload order after being filled', () => {
      const events = [{
        id,
        type: eventTypes.PRODUCT_INVENTORY_FILLED,
        payload: {quantity: 100}
      }];

      const productInventory = productInventoryAggregate.reload(id, events);

      expect(productInventory.product.id).to.equal(id);
      expect(productInventory.remainingQuantity).to.equal(100);
    });

    it('should reload order after being filled twice', () => {
      const events = [{
        id,
        type: eventTypes.PRODUCT_INVENTORY_FILLED,
        payload: {quantity: 10}
      }, {
        id,
        type: eventTypes.PRODUCT_INVENTORY_FILLED,
        payload: {quantity: 100}
      }];

      const productInventory = productInventoryAggregate.reload(id, events);

      expect(productInventory.product.id).to.equal(id);
      expect(productInventory.remainingQuantity).to.equal(110);
    });

    it('should reload order after being validated', () => {
      const events = [{
        id,
        type: eventTypes.PRODUCT_INVENTORY_FILLED,
        payload: {quantity: 100}
      }, {
        id,
        type: eventTypes.PRODUCT_INVENTORY_WITHDRAWN,
        payload: {quantity: 20}
      }];

      const productInventory = productInventoryAggregate.reload(id, events);

      expect(productInventory.product.id).to.equal(id);
      expect(productInventory.remainingQuantity).to.equal(80);
    });
  });

  describe('fill product inventory', () => {
    it('should initialize product inventory when not existing', () => {
      const state = {
        product: {id},
        remainingQuantity: 0
      };

      const command = {
        id,
        quantity: 100
      };

      const {events, error} = productInventoryAggregate.fill(state, command);

      expect(events).to.have.a.lengthOf(1);
      expect(events[0].type).to.equal(eventTypes.PRODUCT_INVENTORY_FILLED);
      expect(events[0].id).to.equal(id);
      expect(events[0].payload.quantity).to.equal(100);
      expect(error).to.not.exist;
    });

    it('should add products to an existing inventory', () => {
      const state = {
        product: {id},
        remainingQuantity: 15
      };

      const command = {
        id,
        quantity: 25
      };

      const {events, error} = productInventoryAggregate.fill(state, command);

      expect(events).to.have.a.lengthOf(1);
      expect(events[0].type).to.equal(eventTypes.PRODUCT_INVENTORY_FILLED);
      expect(events[0].id).to.equal(id);
      expect(events[0].payload.quantity).to.equal(25);
      expect(error).to.not.exist;
    });
  });

  describe('withdraw product inventory', () => {
    it('should withdraw product from inventory', () => {
      const state = {
        product: {id},
        remainingQuantity: 100
      };

      const command = {
        id,
        quantity: 17
      };

      const {events, error} = productInventoryAggregate.withdraw(state, command);

      expect(events).to.have.a.lengthOf(1);
      expect(events[0].type).to.equal(eventTypes.PRODUCT_INVENTORY_WITHDRAWN);
      expect(events[0].id).to.equal(id);
      expect(events[0].payload.quantity).to.equal(17);
      expect(error).to.not.exist;
    });

    it('should mark inventory as depleted when no more products in it', () => {
      const state = {
        product: {id},
        remainingQuantity: 8
      };

      const command = {
        id,
        quantity: 15
      };

      const {events, error} = productInventoryAggregate.withdraw(state, command);

      expect(events).to.have.a.lengthOf(2);
      expect(events[1].type).to.equal(eventTypes.PRODUCT_INVENTORY_DEPLETED);
      expect(events[1].id).to.equal(id);
      expect(error).to.not.exist;
    });
  });
});