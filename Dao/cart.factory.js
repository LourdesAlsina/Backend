export let Cart

switch (config.persistence) {
    case 'MONGO': 
        const { default: CartDAO } = await import('../Dao/cart.mongo.dao.js');
        Cart = CartDAO;
        break;
    case 'FILE':
        const { default: CartFileDAO } = await import('../Dao/cart.file.dao.js');
        Cart = CartFileDAO;
        break;
    default:
        break;
}