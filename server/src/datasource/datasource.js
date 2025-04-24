//TODO: 

// require("dotenv").config();
// const mysql = require("mysql2/promise");
// const { DataSource } = require("typeorm");
// const { Payment } = require("../entity/paymentSchema");
// const { Refund } = require("../entity/refundSchema");

// // Use environment variables or fallback defaults
// const DB_HOST = 'localhost';
// const DB_USER = "root";
// const DB_PASS = "12345678";
// const DB_NAME = "datman";

// // Ensure the database exists
// async function ensureDatabaseExists() {
//   const connection = await mysql.createConnection({
//     host: DB_HOST,
//     user: DB_USER,
//     password: DB_PASS,
//   });
//   try {

//     await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
//     console.log(`📦 Database "${DB_NAME}" is ready.`);
//     await connection.end();

//   } catch (error) {
//     console.log(`Error while creating databases.................`, error);
//   }

// }

// const AppDataSource = new DataSource({
//   type: "mysql",
//   host: DB_HOST,
//   port: 3306,
//   username: DB_USER,
//   password: DB_PASS,
//   database: DB_NAME,
//   synchronize: true, // auto-create tables
//   logging: false,
//   entities: [Payment, Refund],
// });

// // Initialize DB only if it hasn't been initialized already
// async function initializeDatabase() {
//   try {
//     await ensureDatabaseExists();
//     if (!AppDataSource.isInitialized) {
//       await AppDataSource.initialize();
//       console.log("✅ TypeORM Data Source has been initialized and DB is connected!");
//     }
//   } catch (err) {
//     console.error("❌ TypeORM Data Source initialization failed:", err);
//   }
// }

// initializeDatabase();

// module.exports = { AppDataSource };



// ----------------------------------

require("dotenv").config();
const mysql = require("mysql2/promise");
const { DataSource } = require("typeorm");
const { Payment } = require("../entity/paymentSchema");
const { Refund } = require("../entity/refundSchema");

// Database configuration
const DB_HOST = "localhost"; // Use IP to force TCP instead of UNIX socket
const DB_USER = "root";
const DB_PASS = "12345678";
const DB_NAME = "datman";
const DB_PORT = 3306;

// Ensure the database exists
async function ensureDatabaseExists() {
  try {
    console.log("📡 Connecting to MySQL server...");
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      port: DB_PORT,
      socketPath: "/tmp/mysql.sock",
        });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`📦 Database "${DB_NAME}" is ready.`);

    await connection.end();
  } catch (error) {
    console.error("❌ Error while creating the database:", error);
    throw error;
  }
}

// Define the TypeORM Data Source
const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: true, // Only for dev; disable in production
  logging: false,
  entities: [Payment, Refund],
  extra: {
    socketPath: "/tmp/mysql.sock", // ✅ Use your confirmed socket path
  },
});

// Initialize the database
async function initializeDatabase() {
  try {
    await ensureDatabaseExists();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ TypeORM Data Source has been initialized and DB is connected!");
    }
  } catch (err) {
    console.error("❌ TypeORM Data Source initialization failed:", err);
    process.exit(1); // Optional: exit on failure
  }
}

// Start initialization
initializeDatabase();

module.exports = { AppDataSource };
