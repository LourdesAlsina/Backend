export let Product

switch (config.persistence) {
    case 'MONGO': 
        const { default: ProductDAO } = await import('../Dao/product.mongo.dao.js')
        Product = ProductDAO
        break
    case 'FILE':
        const { default: ProducFileDAO } = await import('../Dao/product.file.dao.js')
        Product = ProductFileDAO
        break
        
    default:
        break
}