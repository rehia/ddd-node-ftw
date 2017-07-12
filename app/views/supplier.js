'use strict';

const randomIndex = (size) => Math.floor(Math.random() * size);
const randomValue = (array) => array[randomIndex(array.length)];
const resolved = (value) => Promise.resolve(value);
const assign = (initial) => (mixin) => Object.assign(initial, mixin);

const supplierViews = () => ({
  supplierByProduct: () => resolved(randomValue(suppliers)),
  productFromSupplier: (supplier, id) => resolved(assign({id})(randomValue(products)))
});

const products = [
  {
    reference: '86B53O393',
    quantity: 100,
    price: {
      excludingTaxes: 4.5,
      currency: '€',
      vat: 20.0
    }
  }, {
    reference: '62E581631',
    quantity: 250,
    price: {
      excludingTaxes: 8.0,
      currency: '€',
      vat: 20.0
    }
  }, {
    reference: '3O39386B5',
    quantity: 80,
    price: {
      excludingTaxes: 17.6,
      currency: '€',
      vat: 20.0
    }
  }, {
    reference: '5816231E6',
    quantity: 140,
    price: {
      excludingTaxes: 11.0,
      currency: '€',
      vat: 20.0
    }
  }, {
    reference: '97397BD35',
    quantity: 800,
    price: {
      excludingTaxes: 1.4,
      currency: '€',
      vat: 20.0
    }
  }];

const suppliers = [
  {
    name: 'Occitan’ Inc.',
    address: {
      street: '34, route de la Méditerranée',
      zipCode: '34000',
      city: 'Montpellier',
      country: 'France'
    }
  }, {
    name: 'Atlant’ Inc.',
    address: {
      street: '33, avenue de l’Océan',
      zipCode: '33000',
      city: 'Bordeaux',
      country: 'France'
    }
  }, {
    name: 'Merbus',
    address: {
      street: '31, impasse de la Garonne',
      zipCode: '31000',
      city: 'Toulouse',
      country: 'France'
    }
  }, {
    name: 'DockSeine',
    address: {
      street: '76, boulevard de la Seine',
      zipCode: '76000',
      city: 'Rouen',
      country: 'France'
    }
  }, {
    name: 'Croix Blonde',
    address: {
      street: '69, allée de la Confluence',
      zipCode: '69000',
      city: 'Lyon',
      country: 'France'
    }
  }];

module.exports = supplierViews;