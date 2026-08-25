require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");

const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");

const escapeCSV = (value) => {
  if (value === null || value === undefined) return "";

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

async function exportSalesAnalyticsCSV() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    const orders = await Order.find({
      orderStatus: "Completed",
    }).lean();

    const customers = await Customer.find().lean();
    const products = await Product.find().lean();
    const inventories = await Inventory.find().lean();

    const customerMap = new Map(
      customers.map((customer) => [
        String(customer._id),
        customer,
      ])
    );

    const productMap = new Map(
      products.map((product) => [
        String(product._id),
        product,
      ])
    );

    const inventoryMap = new Map(
      inventories.map((inventory) => [
        String(inventory.product),
        inventory,
      ])
    );

    const rows = [];

    for (const order of orders) {
      const customer = order.customer
        ? customerMap.get(String(order.customer))
        : null;

      for (const item of order.items || []) {
        const product = item.product
          ? productMap.get(String(item.product))
          : null;

        const inventory = item.product
          ? inventoryMap.get(String(item.product))
          : null;

        const quantity = Number(item.quantity || 0);

        const unitPrice =
          Number(item.unitPrice) ||
          Number(item.price) ||
          (quantity > 0
            ? Number(item.total || 0) / quantity
            : 0);

        const revenue = Number(item.total || 0);

        const costPrice = Number(product?.costPrice || 0);

        const cost = costPrice * quantity;

        const profit = revenue - cost;

        const stock = Number(product?.stock || 0);

        let inventoryStatus = "In Stock";

        if (stock === 0) {
          inventoryStatus = "Out of Stock";
        } else if (
          inventory &&
          stock <= Number(inventory.minimumStock || 0)
        ) {
          inventoryStatus = "Critical";
        } else if (
          inventory &&
          stock <= Number(inventory.reorderLevel || 0)
        ) {
          inventoryStatus = "Low Stock";
        }

        rows.push({
          order_id: order.orderId || order._id,
          order_date: order.orderDate,
          order_status: order.orderStatus,

          customer_id:
            customer?.customerId || customer?._id || "",

          customer_name: customer?.name || "",

          customer_segment: customer?.segment || "",

          product_id:
            product?.productId || product?._id || "",

          product_name:
            item.productName || product?.name || "",

          category: product?.category || "",

          quantity,

          unit_price: unitPrice,

          revenue,

          cost,

          profit,

          inventory_stock: stock,

          minimum_stock:
            inventory?.minimumStock || 0,

          reorder_level:
            inventory?.reorderLevel || 0,

          reorder_quantity:
            inventory?.reorderQuantity || 0,

          inventory_status: inventoryStatus,
        });
      }
    }

    const headers = [
      "order_id",
      "order_date",
      "order_status",
      "customer_id",
      "customer_name",
      "customer_segment",
      "product_id",
      "product_name",
      "category",
      "quantity",
      "unit_price",
      "revenue",
      "cost",
      "profit",
      "inventory_stock",
      "minimum_stock",
      "reorder_level",
      "reorder_quantity",
      "inventory_status",
    ];

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => escapeCSV(row[header]))
          .join(",")
      ),
    ].join("\n");

    const outputPath = "./sales_analytics.csv";

    fs.writeFileSync(outputPath, csv);

    console.log("");
    console.log("================================");
    console.log("SALES ANALYTICS CSV CREATED");
    console.log("================================");
    console.log(`Orders      : ${orders.length}`);
    console.log(`CSV rows    : ${rows.length}`);
    console.log(`Products    : ${products.length}`);
    console.log(`Customers   : ${customers.length}`);
    console.log(`Inventory   : ${inventories.length}`);
    console.log(`File        : ${outputPath}`);
    console.log("================================");

    await mongoose.disconnect();
  } catch (error) {
    console.error("CSV export failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

exportSalesAnalyticsCSV();