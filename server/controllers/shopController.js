exports.getProducts = (req, res) => {
    res.json({
        products: [
            { id: 1, name: "Book", price: 5000 },
            { id: 2, name: "Laptop Case", price: 15000 },
            { id: 3, name: "USB Cable", price: 3000 }
        ]
    });
};