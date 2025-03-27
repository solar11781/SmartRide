class Receipt {
  constructor(payment) {
    this.receipt_id = payment.payment_id; // ✅ Must match column in DB
    this.amount = payment.amount;
    this.method = payment.method;
    this.created_at = new Date(payment.created_at); // ✅ Proper Date conversion
  }

  toJSON() {
    return {
      receipt_id: this.receipt_id,
      amount: this.amount,
      method: this.method,
      created_at: this.created_at.toISOString(), // ensure it's a valid string
    };
  }
}

module.exports = Receipt;
