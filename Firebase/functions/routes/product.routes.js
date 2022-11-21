const { Router } = require('express')
const router = Router()
const admin = require('firebase-admin');
//const cors = require('cors');
const db = admin.firestore();

//Para añadir
router.post('/api/products', async (req, res)  => {
    try {
        const {Nombre, Descripcion, Tipo, Imagen, Precio="", Fecha="", Hora=""} = req.body;

        await db.collection("products").add({
            Nombre,
            Descripcion,
            Tipo,
            Imagen,
            Precio,
            Fecha,
            Hora
        });
        return res.status(204).json();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});
/// Añadir categorias

router.post('/api/oferts', async (req, res)  => {
    try {
        const {Name, Product_type, Imagen} = req.body;

        await db.collection("categories").add({
            Name,
            Product_type,
            Imagen
        });
        return res.status(204).json();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

//Para añadir a pedido
router.post('/api/pedido', async (req, res)  => {
    try {
        const {Imagen, PrecioUnitario, PrecioTotal, Hora, FechaLimite, Cantidad, Nota} = req.body;

        await db.collection("pedido").add({
            Imagen,
            PrecioUnitario,
            PrecioTotal,
            Hora,
            FechaLimite,
            Cantidad,
            Nota
        });
        return res.status(204).json();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

//Para obtener
router.get('/api/products/:product_id', async (req, res) => {
    try {
        const doc = db.collection('products').doc(req.params.product_id)
        const item = await doc.get()
        const response = item.data()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).send(error);
    }
})

router.get('/api/products', async (req, res) => {
    try {
        const query = db.collection('products');
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        const response = docs.map(doc => ({
            id: doc.id,
            Nombre: doc.data().Nombre,
            Descripcion: doc.data().Descripcion,
            Tipo: doc.data().Tipo,
            Imagen: doc.data().Imagen,
            Precio: doc.data().Precio,
            Fecha: doc.data().Fecha,
            Hora: doc.data().Hora,

        }))
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json();
    }
});
////Obtener categorias

router.get('/api/oferts', async (req, res) => {
    try {
        const query = db.collection('categories');
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        const response = docs.map(doc => ({
            id: doc.id,
            Name: doc.data().Name,
            Product_type: doc.data().Product_type,
            Imagen: doc.data().Imagen,

        }))
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json();
    }
});

router.get('/api/oferts/:ofert_id', async (req, res) => {
    try {
        let productsFilter = []
        const query = db.collection('products');
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        const products = docs.map(doc => ({
            id: doc.id,
            Nombre: doc.data().Nombre,
            Descripcion: doc.data().Descripcion,
            Tipo: doc.data().Tipo,
            Imagen: doc.data().Imagen,
            Precio: doc.data().Precio,
            Fecha: doc.data().Fecha,
            Hora: doc.data().Hora,

        }))
        const doc = db.collection('categories').doc(req.params.ofert_id)
        const item = await doc.get()
        const response = item.data()
        const categorias = response.Product_type
        
        for(let index = 0 ; index < categorias.length ; index ++){
            const array = products.filter(product => product.Tipo == categorias[index])
            //console.log(array)
            //array= array.filter(product => product.Precio != " ")
            // console.log(`array: ${array}`)
            const result = productsFilter.concat(array)
            productsFilter = result
            console.log(productsFilter)
        }
       
        return res.status(200).json(productsFilter)
    } catch (error) {
        return res.status(500).send(error);
    }
})
router.delete('/api/products/:product_id', async (req, res) => {
    try {
        const document = db.collection('products').doc(req.params.product_id);
        await document.delete();
        return res.status(200).json();
    } catch (error) {
        return res.status(500).json();
    }
});

router.put('/api/products/:product_id', async (req, res) => {
    try {
        const document = db.collection('products').doc(req.params.product_id)
        await document.update({
            Nombre: req.body.Nombre,
            Descripcion: req.body.Descripcion,
            Tipo: req.body.Tipo,
            Imagen: req.body.Imagen,
            Precio: req.body.Precio,
            Fecha: req.body.Fecha,
            Hora: req.body.Hora,
        });
        return res.status(200).json();
    } catch (error) {
        return res.status(500).json();
    }
});
module.exports = router