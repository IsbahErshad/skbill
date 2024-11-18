const fs = require('fs');
const Queue = require('../utils/queue');
const PriorityQueue = require('../utils/priorityQueue');
const Stack = require('../utils/stack');

const queue = new Queue();
const priorityQueue = new PriorityQueue();
const stack = new Stack();

const processPayment = async (req, res) => {
  const { type, amount, urgent } = req.body;
  if (urgent) {
    priorityQueue.enqueue({ type, amount }, 1);
  } else {
    queue.enqueue({ type, amount });
  }
  res.status(200).send('Payment request added to queue.');
};

const handleTransactions = async () => {
  while (!priorityQueue.isEmpty()) {
    const payment = priorityQueue.dequeue();
    await saveTransaction(payment, 'urgent');
  }

  while (!queue.isEmpty()) {
    const payment = queue.dequeue();
    await saveTransaction(payment, 'regular');
  }
};

const saveTransaction = async (payment, status) => {
  const record = `${new Date().toISOString()},${payment.type},${payment.amount},${status}\n`;
  fs.appendFileSync('data/transactions.csv', record);
  stack.push(record);
};

module.exports = { processPayment, handleTransactions };


const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateInvoice = async (req, res) => {
  const { id } = req.params;
  const doc = new PDFDocument();
  const fileName = `invoices/invoice_${id}.pdf`;
  
  doc.pipe(fs.createWriteStream(fileName));
  doc.text(`Invoice ID: ${id}`, { align: 'center' });
  doc.text(`Date: ${new Date().toISOString()}`);
  doc.text(`Thank you for your payment!`, { align: 'center' });
  doc.end();

  res.status(200).send({ message: 'Invoice generated', fileName });
};

module.exports = { generateInvoice };
