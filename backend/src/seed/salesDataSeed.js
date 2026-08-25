const mongoose = require("mongoose");
require("dotenv").config();

const Category = require("../models/Category");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const Inventory = require("../models/Inventory");
const Discount = require("../models/Discount");

const categoriesData = [
  {
    categoryId: "CAT001",
    name: "Laptops",
    description: "Laptops and notebooks",
    status: "active",
  },
  {
    categoryId: "CAT002",
    name: "Smartphones",
    description: "Smartphones and mobile devices",
    status: "active",
  },
  {
    categoryId: "CAT003",
    name: "Accessories",
    description: "Computer and mobile accessories",
    status: "active",
  },
  {
    categoryId: "CAT004",
    name: "Audio",
    description: "Headphones, earbuds and speakers",
    status: "active",
  },
  {
    categoryId: "CAT005",
    name: "Monitors",
    description: "Computer monitors and displays",
    status: "active",
  },
];

const productsData = [
  {
    productId: "P001",
    name: "MacBook Air M3",
    category: "Laptops",
    description: "Apple MacBook Air M3",
    price: 999,
    costPrice: 720,
    stock: 18,
    status: "active",
  },
  {
    productId: "P002",
    name: "Dell Inspiron 15",
    category: "Laptops",
    description: "Dell productivity laptop",
    price: 749,
    costPrice: 540,
    stock: 25,
    status: "active",
  },
  {
    productId: "P003",
    name: "HP Pavilion 14",
    category: "Laptops",
    description: "HP Pavilion laptop",
    price: 699,
    costPrice: 500,
    stock: 12,
    status: "active",
  },
  {
    productId: "P004",
    name: "iPhone 15",
    category: "Smartphones",
    description: "Apple iPhone 15",
    price: 799,
    costPrice: 610,
    stock: 20,
    status: "active",
  },
  {
    productId: "P005",
    name: "Samsung Galaxy S24",
    category: "Smartphones",
    description: "Samsung flagship smartphone",
    price: 849,
    costPrice: 650,
    stock: 15,
    status: "active",
  },
  {
    productId: "P006",
    name: "OnePlus 12",
    category: "Smartphones",
    description: "OnePlus flagship smartphone",
    price: 699,
    costPrice: 520,
    stock: 22,
    status: "active",
  },
  {
    productId: "P007",
    name: "Logitech MX Master 3S",
    category: "Accessories",
    description: "Wireless productivity mouse",
    price: 99,
    costPrice: 55,
    stock: 40,
    status: "active",
  },
  {
    productId: "P008",
    name: "Keychron K2",
    category: "Accessories",
    description: "Mechanical wireless keyboard",
    price: 89,
    costPrice: 48,
    stock: 35,
    status: "active",
  },
  {
    productId: "P009",
    name: "AirPods Pro",
    category: "Audio",
    description: "Apple wireless earbuds",
    price: 249,
    costPrice: 165,
    stock: 28,
    status: "active",
  },
  {
    productId: "P010",
    name: "Sony WH-1000XM5",
    category: "Audio",
    description: "Premium noise cancelling headphones",
    price: 399,
    costPrice: 275,
    stock: 16,
    status: "active",
  },
  {
    productId: "P011",
    name: "JBL Flip 6",
    category: "Audio",
    description: "Portable Bluetooth speaker",
    price: 129,
    costPrice: 75,
    stock: 30,
    status: "active",
  },
  {
    productId: "P012",
    name: "Dell 27 Monitor",
    category: "Monitors",
    description: "27 inch Full HD monitor",
    price: 279,
    costPrice: 185,
    stock: 14,
    status: "active",
  },
  {
    productId: "P013",
    name: "LG UltraWide 34",
    category: "Monitors",
    description: "34 inch UltraWide monitor",
    price: 499,
    costPrice: 340,
    stock: 10,
    status: "active",
  },
  {
    productId: "P014",
    name: "Anker USB-C Hub",
    category: "Accessories",
    description: "Multi-port USB-C hub",
    price: 59,
    costPrice: 30,
    stock: 45,
    status: "active",
  },
  {
    productId: "P015",
    name: "Apple Magic Keyboard",
    category: "Accessories",
    description: "Apple wireless keyboard",
    price: 129,
    costPrice: 78,
    stock: 20,
    status: "active",
  },
];

const customersData = [
  ["C001", "Aarav Sharma", "aarav@example.com", "9876500001", "premium"],
  ["C002", "Ananya Singh", "ananya@example.com", "9876500002", "regular"],
  ["C003", "Rohan Verma", "rohan@example.com", "9876500003", "regular"],
  ["C004", "Priya Gupta", "priya@example.com", "9876500004", "premium"],
  ["C005", "Rahul Mehta", "rahul@example.com", "9876500005", "new"],
  ["C006", "Sneha Kapoor", "sneha@example.com", "9876500006", "regular"],
  ["C007", "Aditya Jain", "aditya@example.com", "9876500007", "premium"],
  ["C008", "Kavya Rao", "kavya@example.com", "9876500008", "regular"],
  ["C009", "Arjun Malhotra", "arjun@example.com", "9876500009", "new"],
  ["C010", "Isha Agarwal", "isha@example.com", "9876500010", "premium"],
  ["C011", "Vivek Shah", "vivek@example.com", "9876500011", "regular"],
  ["C012", "Neha Das", "neha@example.com", "9876500012", "new"],
  ["C013", "Karan Patel", "karan@example.com", "9876500013", "regular"],
  ["C014", "Meera Iyer", "meera@example.com", "9876500014", "premium"],
  ["C015", "Sahil Khan", "sahil@example.com", "9876500015", "regular"],
  ["C016", "Pooja Nair", "pooja@example.com", "9876500016", "new"],
  ["C017", "Dev Mishra", "dev@example.com", "9876500017", "regular"],
  ["C018", "Riya Sen", "riya@example.com", "9876500018", "premium"],
  ["C019", "Nikhil Roy", "nikhil@example.com", "9876500019", "new"],
  ["C020", "Simran Kaur", "simran@example.com", "9876500020", "regular"],
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    // Clear existing analytics demo data
    await Order.deleteMany({});
    await Transaction.deleteMany({});
    await Inventory.deleteMany({});
    await Discount.deleteMany({});
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Category.deleteMany({});

    console.log("Old sales data cleared");

    // Categories
    await Category.insertMany(categoriesData);

    // Products
    const products = await Product.insertMany(productsData);

    // Customers
    const customers = await Customer.insertMany(
      customersData.map(
        ([customerId, name, email, phone, segment]) => ({
          customerId,
          name,
          email,
          phone,
          address: "India",
          orders: 0,
          totalSpent: 0,
          segment,
          status: "active",
        })
      )
    );

    console.log("Categories, products and customers inserted");

    // Create orders
    const orders = [];
    const transactions = [];

    for (let i = 1; i <= 50; i++) {
      const customer = customers[(i - 1) % customers.length];

      const product1 = products[(i - 1) % products.length];

      const product2 =
        i % 3 === 0
          ? products[(i + 3) % products.length]
          : null;

      const quantity1 = (i % 3) + 1;

      const item1Total =
        product1.price * quantity1;

      const items = [
        {
          product: product1._id,
          productName: product1.name,
          quantity: quantity1,
          unitPrice: product1.price,
          discount: i % 5 === 0 ? 20 : 0,
          total:
            item1Total -
            (i % 5 === 0 ? 20 : 0),
        },
      ];

      if (product2) {
        const quantity2 = (i % 2) + 1;

        items.push({
          product: product2._id,
          productName: product2.name,
          quantity: quantity2,
          unitPrice: product2.price,
          discount: 0,
          total:
            product2.price * quantity2,
        });
      }

      const subtotal = items.reduce(
        (sum, item) =>
          sum + item.unitPrice * item.quantity,
        0
      );

      const discountAmount = items.reduce(
        (sum, item) => sum + item.discount,
        0
      );

      const taxAmount = Math.round(
        (subtotal - discountAmount) * 0.18
      );

      const totalAmount =
        subtotal -
        discountAmount +
        taxAmount;

      const orderDate = new Date();
      orderDate.setDate(
        orderDate.getDate() - (50 - i)
      );

      const order = {
        orderId: `ORD${String(i).padStart(4, "0")}`,
        customer: customer._id,
        items,
        subtotal,
        discountAmount,
        taxAmount,
        totalAmount,
        paymentMethod:
          ["UPI", "Card", "Cash", "Bank Transfer"][
            i % 4
          ],
        paymentStatus: "Paid",
        orderStatus: "Completed",
        orderDate,
      };

      orders.push(order);
    }

    const insertedOrders =
      await Order.insertMany(orders);

    console.log("50 orders inserted");

    // Create transactions
    for (const order of insertedOrders) {
      transactions.push({
        transactionId:
          `TXN-${order.orderId}`,
        order: order._id,
        customer: order.customer,
        type: "Sale",
        amount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: "Completed",
        transactionDate: order.orderDate,
        description:
          `Sale transaction for ${order.orderId}`,
      });
    }

    await Transaction.insertMany(transactions);

    console.log("50 transactions inserted");

    // Update customer statistics
    for (const customer of customers) {
      const customerOrders =
        insertedOrders.filter(
          (order) =>
            order.customer.toString() ===
            customer._id.toString()
        );

      const totalSpent =
        customerOrders.reduce(
          (sum, order) =>
            sum + order.totalAmount,
          0
        );

      await Customer.updateOne(
        { _id: customer._id },
        {
          $set: {
            orders: customerOrders.length,
            totalSpent,
          },
        }
      );
    }

    // Inventory
    await Inventory.insertMany(
      products.map((product, index) => {
        let status = "In Stock";

        if (product.stock === 0) {
          status = "Out of Stock";
        } else if (product.stock <= 10) {
          status = "Critical";
        } else if (product.stock <= 20) {
          status = "Low Stock";
        }

        return {
          inventoryId: `INV${String(
            index + 1
          ).padStart(3, "0")}`,
          product: product._id,
          minimumStock: 10,
          reorderLevel: 20,
          reorderQuantity: 30,
          reservedQuantity: 0,
          lastRestockedAt: new Date(),
          status,
        };
      })
    );

    console.log("Inventory inserted");

    // Discounts
    await Discount.insertMany([
      {
        discountId: "DISC001",
        campaignName: "Summer Sale",
        promoCode: "SUMMER10",
        discountType: "Percentage",
        discountValue: 10,
        minOrderValue: 500,
        maxDiscount: 100,
        redemptions: 18,
        revenueGenerated: 7200,
        status: "Active",
        startDate: new Date("2026-06-01"),
        endDate: new Date("2026-09-30"),
      },
      {
        discountId: "DISC002",
        campaignName: "Laptop Offer",
        promoCode: "LAPTOP50",
        discountType: "Fixed Amount",
        discountValue: 50,
        minOrderValue: 700,
        maxDiscount: 50,
        redemptions: 12,
        revenueGenerated: 5800,
        status: "Active",
        startDate: new Date("2026-07-01"),
        endDate: new Date("2026-09-15"),
      },
      {
        discountId: "DISC003",
        campaignName: "New Customer Offer",
        promoCode: "WELCOME15",
        discountType: "Percentage",
        discountValue: 15,
        minOrderValue: 300,
        maxDiscount: 150,
        redemptions: 9,
        revenueGenerated: 3400,
        status: "Active",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
      },
    ]);

    console.log("Discounts inserted");

    console.log("\n================================");
    console.log("SALES ANALYTICS SEED COMPLETED");
    console.log("================================");
    console.log("Categories : 5");
    console.log("Products   : 15");
    console.log("Customers  : 20");
    console.log("Orders     : 50");
    console.log("Transactions: 50");
    console.log("Inventory  : 15");
    console.log("Discounts  : 3");
    console.log("================================\n");

    await mongoose.disconnect();
  } catch (error) {
    console.error("SEED ERROR:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();