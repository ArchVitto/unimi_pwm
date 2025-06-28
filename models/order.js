import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  username: { type: String, required: true },
  cardHolder: { type: String, required: true },
  partitaIva: { type: String, required: true },
  total: { type: Number, required: true },
  products: [
    {
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  status: {
    status: {
      type: String,
      enum: ['ordinato', 'in preparazione', 'consegnato', 'annullato'],
      default: 'ordinato',
    },
    startDate: {
      type: Date,
      required: false,
    },
    expireDate: {
      type: Date,
      required: false,
    }
  },
  orderDate: { type: Date, default: Date.now },
});

export const Order = mongoose.model('Order', orderSchema);
