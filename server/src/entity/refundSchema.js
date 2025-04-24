const { EntitySchema } = require("typeorm");

const Refund = new EntitySchema({
  name: "Refund",
  tableName: "refunds",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true, // Auto-increment
    },
    refundId: {
      type: "varchar",
      primary: true,
    },
    transactionId: {
      primary: true,
      type: "varchar",
    },
    pspReference: {
      type: "varchar",
      nullable: true, // in case it's not present during first insert
    },
    paymentLinkId:{
      type:"varchar"
    },
    status: {
      type: "varchar",
    },
    refundAmount: {
      type: "int",
    },
    idempotencyKey: {
      type: "varchar",
      length: 64,
      nullable: true, // In case you don't always use it
      unique: true,   // Optional: if you want to enforce uniqueness
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
});

module.exports = { Refund };
