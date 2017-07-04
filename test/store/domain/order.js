/*eslint no-unused-vars:0 */
'use strict';

const {expect} = require('chai');

const DomainError = require('../../../app/errors/DomainError');
const orderAggregate = require('../../../app/store/domain/order');
const eventTypes = require('../../../app/store/domain/eventTypes');

describe('order aggregate behavior', () => {
  const products = [{
    id: '1753O713',
    quantity: 1,
    price: {
      excludingTaxes: 10.0,
      currency: '€',
      vat: 20.0
    }
  }, {
    id: '61947089',
    quantity: 2,
    price: {
      excludingTaxes: 15.0,
      currency: '€',
      vat: 20.0
    }
  }];

  describe('reload aggregate', () => {
    it('should reload order after being created', () => {
      const events = [{
        id: 'd45f328e',
        type: eventTypes.ORDER_CREATED,
        payload: {
          user: 'john.doe',
          products
        }
      }];

      const order = orderAggregate.reload('d45f328e', events);

      expect(order.id).to.equal('d45f328e');
      expect(order.user).to.equal('john.doe');
      expect(order.products).to.have.a.lengthOf(2);
      expect(order.status).to.equal('created');
    });

    it('should reload order after being validated', () => {
      const events = [{
        id: 'd45f328e',
        type: eventTypes.ORDER_CREATED,
        payload: {
          user: 'john.doe',
          products
        }
      }, {
        id: 'd45f328e',
        type: eventTypes.ORDER_VALIDATED,
      }];

      const order = orderAggregate.reload('d45f328e', events);

      expect(order.id).to.equal('d45f328e');
      expect(order.status).to.equal('validated');
    });
  });

  describe('create order', () => {
    it('should create order', () => {
      const command = {
        user: 'john.doe',
        products
      };

      const result = orderAggregate.create(command);

      expect(result.events).to.have.a.lengthOf(1);
      expect(result.events[0].type).to.equal(eventTypes.ORDER_CREATED);
      expect(result.events[0].payload.user).to.equal('john.doe');
      expect(result.events[0].payload.products).to.have.a.lengthOf(2);
      expect(result.error).to.not.exist;
    });
  });

  describe('validate order', () => {
    it('should validate order when created', () => {
      const state = {
        id: 'd45f328e',
        user: 'john.doe',
        products,
        status: 'created'
      };

      const command = {id:'d45f328e'};

      const result = orderAggregate.validate(state, command);

      expect(result.events).to.have.a.lengthOf(1);
      expect(result.events[0].type).to.equal(eventTypes.ORDER_VALIDATED);
      expect(result.error).to.not.exist;
    });

    it('should not validate order when already canceled', () => {
      const state = {
        id: 'd45f328e',
        user: 'john.doe',
        products,
        status: 'canceled'
      };

      const command = {id:'d45f328e'};

      const result = orderAggregate.validate(state, command);

      expect(result.events).to.be.empty;
      expect(result.error).to.be.an.instanceOf(DomainError);
    });

    it('should not validate order when already validated', () => {
      const state = {
        id: 'd45f328e',
        user: 'john.doe',
        products,
        status: 'validated'
      };

      const command = {id:'d45f328e'};

      const result = orderAggregate.validate(state, command);

      expect(result.events).to.be.empty;
      expect(result.error).to.be.an.instanceOf(DomainError);
    });
  });
});