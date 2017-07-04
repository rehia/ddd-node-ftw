'use strict';

const validateOrderSaga = ({validateOrder}, {withdrawProductInventory, fillProductInventory}, {getOrder}) => {
  const withdrawAllProductInventories = async ({products}) =>
    await Promise.all(
      products
        .map(async({id, quantity}) =>
          await withdrawProductInventory({id, quantity})
        )
    );

  const fillAllProductInventories = async ({products}) =>
    await Promise.all(
      products
        .map(async({id, quantity}) =>
          await fillProductInventory({id, quantity})
        )
    );

  return async({id}) => {
    const order = await getOrder(id);

    await withdrawAllProductInventories(order);

    try {
      await validateOrder({id});
    } catch (error) {
      await fillAllProductInventories(order);
      throw error;
    }
  };
};

module.exports = validateOrderSaga;