/*eslint no-unused-vars:0 */
'use strict';

const {expect} = require('chai');

const orderAggregate = require('../../../app/store/domain/order');
const eventTypes = require('../../../app/store/domain/eventTypes');

describe('order aggregate behavior', () => {
  it('should create order', () => {
    const command = {
      user: 'john.doe',
      products: [{
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
      }]
    };

    const result = orderAggregate.create(command);

    expect(result.events).to.have.a.lengthOf(1);
    expect(result.events[0].type).to.equal(eventTypes.ORDER_CREATED);
    expect(result.events[0].payload.user).to.equal('john.doe');
    expect(result.events[0].payload.products).to.have.a.lengthOf(2);
    expect(result.error).to.not.exist;
  });
});