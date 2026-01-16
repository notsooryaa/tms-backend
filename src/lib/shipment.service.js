const Shipment = require('../models/shipment.model');
const ShipmentSources = require('../models/shipmentSources.model');
const ShipmentDestinations = require('../models/shipmentDestinations.model');
const ShipmentMaterial = require('../models/shipmentMaterial.model');
const Material = require('../models/material.model');
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
        
        const flattenedMaterials = data.materials.flat();
        
        const hasMaterialNames = flattenedMaterials.some(m => m.materialName);
        let materials;
        
        if (hasMaterialNames) {
            const materialNames = flattenedMaterials.map(m => m.materialName);
            const [vehicleCapacity, foundMaterials] = await Promise.all([
                VechicleType.findOne({ _id: data.vehicleType }),
                Material.find({ name: { $in: materialNames } })
            ]);
            materials = foundMaterials;
            var vehicleCapacityVar = vehicleCapacity;
        } else {
            const materialIds = flattenedMaterials.map(m => m.materialId);
            const [vehicleCapacity, foundMaterials] = await Promise.all([
                VechicleType.findOne({ _id: data.vehicleType }),
                Material.find({ _id: { $in: materialIds } })
            ]);
            materials = foundMaterials;
            var vehicleCapacityVar = vehicleCapacity;
        }
        
        const vehicleCapacity = vehicleCapacityVar;

        if (!vehicleCapacity) {
            throw new Error('Vehicle type not found');
        }

        const materialMap = hasMaterialNames
            ? new Map(materials.map(m => [m.name, m]))
            : new Map(materials.map(m => [m._id.toString(), m]));

        let totalWeight = 0;
        let totalVolume = 0;
        let totalQuantity = 0;

        for (const materialItem of flattenedMaterials) {
            const materialKey = hasMaterialNames 
                ? materialItem.materialName 
                : materialItem.materialId.toString();
            const material = materialMap.get(materialKey);
            if (!material) {
                const identifier = hasMaterialNames ? `name ${materialItem.materialName}` : `ID ${materialItem.materialId}`;
                throw new Error(`Material with ${identifier} not found`);
            }

            const quantity = parseFloat(materialItem.quantity);
            totalWeight += material.weightPerUnit * quantity;
            totalVolume += material.volumePerUnit * quantity;
            totalQuantity += quantity;
        }

        if (totalWeight > vehicleCapacity.weight) {
            throw new Error(`Total weight ${totalWeight} exceeds vehicle capacity of ${vehicleCapacity.weight}`);
        }
        if (totalVolume > vehicleCapacity.volume) {
            throw new Error(`Total volume ${totalVolume} exceeds vehicle capacity of ${vehicleCapacity.volume}`);
        }

        const shipment = new Shipment({
            ...shipmentData,
            totalWeight,
            totalVolume,
            totalQuantity
        });

        await shipment.save();

        const shipmentMaterials = [];
        data.materials.forEach((materialGroup, index) => {
            const orderNumber = data.orderNumber[index];
            materialGroup.forEach(materialItem => {
                const materialKey = hasMaterialNames ? materialItem.materialName : materialItem.materialId.toString();
                const material = materialMap.get(materialKey);
                shipmentMaterials.push({
                    shipmentId: shipment._id,
                    materialId: material._id,
                    quantity: materialItem.quantity,
                    orderNumber: orderNumber
                });
            });
        });

        const shipmentSources = data.source.map((location, index) => ({
            shipmentId: shipment._id,
            sourceLocation: location,
            orderNumber: data.orderNumber[index]
        }));

        const shipmentDestinations = data.destination.map((location, index) => ({
            shipmentId: shipment._id,
            destinationLocation: location,
            orderNumber: data.orderNumber[index]
        }));

        await Promise.all([
            ShipmentMaterial.insertMany(shipmentMaterials),
            ShipmentSources.insertMany(shipmentSources),
            ShipmentDestinations.insertMany(shipmentDestinations)
        ]);

        return shipment;
    }

    async updateShipment(id, data) {
        const shipment = await Shipment.findById(id);
        if (!shipment) {
            throw new Error('Shipment not found');
        }

        if (data.transportType) shipment.transportType = data.transportType;
        if (data.vehicleType) shipment.vehicleType = data.vehicleType;
        if (data.groupId) shipment.groupId = data.groupId;

        const sourcesToInsert = [];
        const destinationsToInsert = [];
        const materialsToInsert = [];

        if (data.additionalSources && data.additionalSources.length > 0) {
            sourcesToInsert.push(...data.additionalSources.map(source => ({
                shipmentId: shipment._id,
                sourceLocation: source.location,
                orderNumber: source.orderNumber
            })));
        }

        if (data.additionalDestinations && data.additionalDestinations.length > 0) {
            destinationsToInsert.push(...data.additionalDestinations.map(destination => ({
                shipmentId: shipment._id,
                destinationLocation: destination.location,
                orderNumber: destination.orderNumber
            })));
        }

        if (data.additionalMaterials && data.additionalMaterials.length > 0) {
            const materialIds = data.additionalMaterials.map(m => m.materialId);
            const materials = await Material.find({ _id: { $in: materialIds } });
            const materialMap = new Map(materials.map(m => [m._id.toString(), m]));

            let additionalWeight = 0;
            let additionalVolume = 0;
            let additionalQuantity = 0;

            for (const materialItem of data.additionalMaterials) {
                const material = materialMap.get(materialItem.materialId.toString());
                if (!material) {
                    throw new Error(`Material with ID ${materialItem.materialId} not found`);
                }

                const quantity = materialItem.quantity;
                additionalWeight += material.weightPerUnit * quantity;
                additionalVolume += material.volumePerUnit * quantity;
                additionalQuantity += quantity;

                materialsToInsert.push({
                    shipmentId: shipment._id,
                    materialId: materialItem.materialId,
                    quantity: materialItem.quantity,
                    orderNumber: materialItem.orderNumber
                });
            }

            shipment.totalWeight += additionalWeight;
            shipment.totalVolume += additionalVolume;
            shipment.totalQuantity += additionalQuantity;

            const vehicleType = data.vehicleType || shipment.vehicleType;
            const vehicleCapacity = await VechicleType.findById(vehicleType);
            
            if (vehicleCapacity) {
                if (shipment.totalWeight > vehicleCapacity.weight) {
                    throw new Error(`Total weight ${shipment.totalWeight} exceeds vehicle capacity of ${vehicleCapacity.weight}`);
                }
                if (shipment.totalVolume > vehicleCapacity.volume) {
                    throw new Error(`Total volume ${shipment.totalVolume} exceeds vehicle capacity of ${vehicleCapacity.volume}`);
                }
            }
        }

        const operations = [shipment.save()];
        
        if (sourcesToInsert.length > 0) {
            operations.push(ShipmentSources.insertMany(sourcesToInsert));
        }
        if (destinationsToInsert.length > 0) {
            operations.push(ShipmentDestinations.insertMany(destinationsToInsert));
        }
        if (materialsToInsert.length > 0) {
            operations.push(ShipmentMaterial.insertMany(materialsToInsert));
        }

        await Promise.all(operations);

        return shipment;
    }

    async deleteShipment(id) {
        return await Shipment.findByIdAndDelete(id);
    }

    async updateShipmentStatus(shipmentId, status) {
        const validStatuses = ['pending', 'in-transit', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }

        const shipment = await Shipment.findByIdAndUpdate(
            shipmentId,
            { status },
            { new: true }
        );

        if (!shipment) {
            throw new Error('Shipment not found');
        }

        return shipment;
    }

    async updatePickupStatus(sourceId, status) {
        const validStatuses = ['pending', 'picked-up', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid pickup status. Must be one of: ${validStatuses.join(', ')}`);
        }

        const source = await ShipmentSources.findByIdAndUpdate(
            sourceId,
            { status },
            { new: true }
        );

        if (!source) {
            throw new Error('Pickup location not found');
        }

        return source;
    }

    async updateDropStatus(destinationId, status) {
        const validStatuses = ['pending', 'in-transit', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid drop status. Must be one of: ${validStatuses.join(', ')}`);
        }

        const destination = await ShipmentDestinations.findByIdAndUpdate(
            destinationId,
            { status },
            { new: true }
        );

        if (!destination) {
            throw new Error('Drop location not found');
        }

        return destination;
    }

    async getShipmentStatusSummary(shipmentId) {
        const [shipment, sources, destinations, shipmentMaterials] = await Promise.all([
            Shipment.findById(shipmentId),
            ShipmentSources.find({ shipmentId }),
            ShipmentDestinations.find({ shipmentId }),
            ShipmentMaterial.find({ shipmentId }).populate('materialId')
        ]);

        if (!shipment) {
            throw new Error('Shipment not found');
        }

        const orderMap = new Map();

        sources.forEach(s => {
            if (!orderMap.has(s.orderNumber)) {
                orderMap.set(s.orderNumber, { orderNumber: s.orderNumber, pickups: [], drops: [], materials: [] });
            }
            orderMap.get(s.orderNumber).pickups.push({
                id: s._id,
                location: s.sourceLocation,
                status: s.status
            });
        });

        destinations.forEach(d => {
            if (!orderMap.has(d.orderNumber)) {
                orderMap.set(d.orderNumber, { orderNumber: d.orderNumber, pickups: [], drops: [], materials: [] });
            }
            orderMap.get(d.orderNumber).drops.push({
                id: d._id,
                location: d.destinationLocation,
                status: d.status
            });
        });

        shipmentMaterials.forEach(sm => {
            if (!orderMap.has(sm.orderNumber)) {
                orderMap.set(sm.orderNumber, { orderNumber: sm.orderNumber, pickups: [], drops: [], materials: [] });
            }
            orderMap.get(sm.orderNumber).materials.push({
                id: sm._id,
                materialId: sm.materialId._id,
                materialName: sm.materialId.name,
                quantity: sm.quantity,
                weightPerUnit: sm.materialId.weightPerUnit,
                volumePerUnit: sm.materialId.volumePerUnit
            });
        });

        const orders = Array.from(orderMap.values());

        return {
            shipment: {
                id: shipment._id,
                status: shipment.status,
                groupId: shipment.groupId
            },
            orders,
            weight: shipment.totalWeight,
            volume: shipment.totalVolume,
            quantity: shipment.totalQuantity
        };
    }
}

module.exports = new ShipmentService();