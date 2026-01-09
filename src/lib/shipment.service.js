const Shipment = require('../models/shipment.model');
const ShipmentSources = require('../models/shipmentSources.model');
const ShipmentDestinations = require('../models/shipmentDestinations.model');
const VechicleType = require('../models/vechicleType.model');
const { createShipmentData, uploadXLSX } = require('../utils/shipment.util.js');

class ShipmentService {
    async getAllShipments() {
        return await Shipment.aggregate([
            {
                $lookup: {
                    from: 'shipmentsources',
                    localField: '_id',
                    foreignField: 'shipmentId',
                    as: 'sourceDetails'
                }
            },
            {
                $lookup: {
                    from: 'shipmentdestinations',
                    localField: '_id',
                    foreignField: 'shipmentId',
                    as: 'destinationDetails'
                }
            },
        ]);
    }

    async getShipmentById(id) {
        return await Shipment.findById(id).aggregate([
            {
                $lookup: {
                    from: 'shipmentsources',
                    localField: '_id',
                    foreignField: 'shipmentId',
                    as: 'sourceDetails'
                }
            },
            {
                $lookup: {
                    from: 'shipmentdestinations',
                    localField: '_id',
                    foreignField: 'shipmentId',
                    as: 'destinationDetails'
                }
            },
            {
                $unwind: '$sourceDetails'
            },
            {
                $unwind: '$destinationDetails'
            }
        ]);
    }
    
    async createShipment(data) {
        const shipmentData = createShipmentData(data);
        console.log(data);
        const shipment = new Shipment(shipmentData);
        const findVechicleCapacity = await VechicleType.findOne({ _id: data.vehicleType });

        let checkWeight = data.weight.reduce((a, b) => a + b, 0) > findVechicleCapacity.weight
        let checkVolume = data.volume.reduce((a, b) => a + b, 0) > findVechicleCapacity.volume

        if (checkWeight) {
            throw new Error(`Total weight exceeds vehicle capacity of ${findVechicleCapacity.weight}`);
        }
        if (checkVolume) {
            throw new Error(`Total volume exceeds vehicle capacity of ${findVechicleCapacity.volume}`);
        }

        data.source.forEach(async (element, index) => {
          let shipmentSourceData = {
            shipmentId: shipment._id,
            sourceLocation: element,
            orderNumber: shipment.orderNumber[index],
          };
          const shipmentSource = new ShipmentSources(shipmentSourceData);
          await shipmentSource.save();
        });
        
        data.destination.forEach(async (element, index) => {
          let shipmentDestinationData = {
            shipmentId: shipment._id,
            destinationLocation: element,
            orderNumber: shipment.orderNumber[index],
          };
          const shipmentDestination = new ShipmentDestinations(
            shipmentDestinationData
          );
          await shipmentDestination.save();
        });

        await shipment.save();
        return shipment;
    }

    async updateShipment(id, data) {
        return await Shipment.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteShipment(id) {
        return await Shipment.findByIdAndDelete(id);
    }
}

module.exports = new ShipmentService();