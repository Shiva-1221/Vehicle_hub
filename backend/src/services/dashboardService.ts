import User from "../models/User";
import Vehicle from "../models/Vehicle";
import Booking from "../models/Booking";

export const getDashboardStats =
  async () => {
    const totalCustomers =
      await User.countDocuments({
        role: "customer",
      });

    const totalVehicles =
      await Vehicle.countDocuments();

    const activeRentals =
      await Booking.countDocuments({
        status: "Active",
      });

    const pendingBookings =
      await Booking.countDocuments({
        status: "Pending",
      });

    const approvedBookings =
      await Booking.countDocuments({
        status: "Approved",
      });

    const completedBookings =
      await Booking.countDocuments({
        status: "Completed",
      });

    const cancelledBookings =
      await Booking.countDocuments({
        status: "Cancelled",
      });

    const totalBookings =
      await Booking.countDocuments();

    const revenueResult =
      await Booking.aggregate([
        {
          $match: {
            status: {
              $in: [
                "Approved",
                "Active",
                "Completed",
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    return {
      totalCustomers,
      totalVehicles,
      activeRentals,
      pendingBookings,
      approvedBookings,
      completedBookings,
      cancelledBookings,
      totalBookings,
      totalRevenue,
    };
  };