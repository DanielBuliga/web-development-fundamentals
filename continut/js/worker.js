self.onmessage = function (event) {
    const product = event.data;
    console.log(`Worker: Am primit produsul #${product.id} - ${product.name} (${product.quantity})`);
    

    self.postMessage(product);
  };