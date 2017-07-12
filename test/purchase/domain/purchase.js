/*eslint no-unused-vars:0 */
'use strict';

const {expect} = require('chai');

const DomainError = require('../../../app/errors/DomainError');
const purchaseAggregate = require('../../../app/purchase/domain/purchase');
const eventTypes = require('../../../app/purchase/domain/eventTypes');

describe('purchase aggregate behavior', () => {
  const products = [{
    id: '1753O713',
    reference: '86B53O393',
    quantity: 100,
    price: {
      excludingTaxes: 4.5,
      currency: '€',
      vat: 20.0
    }
  }, {
    id: '61947089',
    reference: '62E581631',
    quantity: 250,
    price: {
      excludingTaxes: 8.0,
      currency: '€',
      vat: 20.0
    }
  }];

  const supplier = {
    name: 'Occitan’ Inc.',
    address: {
      street: '34, route de la Méditerranée',
      zipCode: '34000',
      city: 'Montpellier',
      country: 'France'
    }
  };

  describe('reload aggregate', () => {
    it('should reload order after products purchase', () => {
      const events = [{
        id: '953fe4cd',
        type: eventTypes.PRODUCTS_PURCHASED,
        payload: {
          supplier,
          products
        }
      }];

      const purchase = purchaseAggregate.reload('953fe4cd', events);

      expect(purchase.id).to.equal('953fe4cd');
      expect(purchase.supplier.name).to.equal('Occitan’ Inc.');
      expect(purchase.products).to.have.a.lengthOf(2);
    });
  });

  describe('purchase products', () => {
    it('should purchase products', () => {
      const command = {
        id: '953fe4cd',
        supplier,
        products
      };

      const {events, error} = purchaseAggregate.purchaseProducts(command);

      expect(events).to.have.a.lengthOf(1);
      expect(events[0].type).to.equal(eventTypes.PRODUCTS_PURCHASED);
      expect(events[0].id).to.equal('953fe4cd');
      expect(events[0].payload.supplier.name).to.equal('Occitan’ Inc.');
      expect(events[0].payload.products).to.have.a.lengthOf(2);
      expect(error).to.not.exist;
    });
  });
});