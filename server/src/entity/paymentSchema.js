const { EntitySchema } = require("typeorm");

module.exports.Payment = new EntitySchema({
  name: "Payment",
  tableName: "payments",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true, // Auto-increment
    },
    transactionId: {
      primary: true,
      type: "varchar",
    },
    paymentLinkId:{
      type:"varchar"
    },
    pspReference: {
      type: "varchar",
      nullable: true, // in case it's not present during first insert
    },
    merchantReference: {
      type: "varchar",
    },
    status: {
      type: "varchar",
    },
    amount: {
      type: "int",
    },
    currency: {
      type: "varchar",
    },
    refundedFlag:{
      type:"boolean",
      default:false
    },
    idempotencyKey: {
      type: "varchar",
      length: 64,
      nullable: true, // In case you don't always use it
      unique: true,   // Optional: if you want to enforce uniqueness
    },
    createdAt: {
      type: "datetime",
    },
    updatedAt: {
      type: "datetime",
    },
  },
});
