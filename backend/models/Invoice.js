// models/Invoice.js
class Invoice {
    constructor(ride) {
      this.ride_id = ride.ride_id;
      this.user_id = ride.user_id;
      this.vehicle_type = ride.vehicle_type;
      this.distance_km = ride.distance_km;
      this.amount = this.calculateAmount();
      this.status = "Unpaid";
    }
  
    calculateAmount() {
      const rate = this.vehicle_type === "Car" ? 8000 : 5000; // VND per km
      return this.distance_km * rate;
    }
  
    toJSON() {
      return {
        ride_id: this.ride_id,
        user_id: this.user_id,
        amount: this.amount,
        status: this.status,
      };
    }
  }
  
  module.exports = Invoice;
  