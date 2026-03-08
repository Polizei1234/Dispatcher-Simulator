/**
 * 🚑 VEHICLE SERVICE
 * Service layer for vehicle management.
 */

const VehicleService = (store) => {
  const dispatchVehicle = (vehicleId, incidentId) => {
    // Logic to dispatch a vehicle
    console.log('VehicleService: Dispatching vehicle');
  };

  return {
    dispatchVehicle,
  };
};

export default VehicleService;
