const TransportTypeService = require('../transportType.service');
const Tranport = require('../../models/tranportType.model');

jest.mock('../../models/tranportType.model');

describe('TransportTypeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllTransportTypes', () => {
        it('should return all transport types', async () => {
            const mockTransportTypes = [
                {
                    _id: '507f1f77bcf86cd799439011',
                    name: 'Road Transport',
                    vehicle_number: 'TN01AB1234',
                    address: '123 Main St, Chennai',
                    emailId: 'road@transport.com',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    _id: '507f1f77bcf86cd799439012',
                    name: 'Rail Transport',
                    vehicle_number: 'TN02CD5678',
                    address: '456 Station Rd, Chennai',
                    emailId: 'rail@transport.com',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            Tranport.find.mockResolvedValue(mockTransportTypes);

            const result = await TransportTypeService.getAllTransportTypes();

            expect(Tranport.find).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockTransportTypes);
            expect(result).toHaveLength(2);
        });

        it('should return empty array when no transport types exist', async () => {
            Tranport.find.mockResolvedValue([]);

            const result = await TransportTypeService.getAllTransportTypes();
            expect(Tranport.find).toHaveBeenCalledTimes(1);
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should throw error when database operation fails', async () => {
            const errorMessage = 'Database connection failed';
            Tranport.find.mockRejectedValue(new Error(errorMessage));

            await expect(TransportTypeService.getAllTransportTypes())
                .rejects
                .toThrow(errorMessage);
            expect(Tranport.find).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTransportTypeById', () => {
        it('should return transport type by id', async () => {
            const mockId = '507f1f77bcf86cd799439011';
            const mockTransportType = {
                _id: mockId,
                name: 'Road Transport',
                vehicle_number: 'TN01AB1234',
                address: '123 Main St, Chennai',
                emailId: 'road@transport.com',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            Tranport.findById.mockResolvedValue(mockTransportType);

            const result = await TransportTypeService.getTransportTypeById(mockId);

            expect(Tranport.findById).toHaveBeenCalledTimes(1);
            expect(Tranport.findById).toHaveBeenCalledWith(mockId);
            expect(result).toEqual(mockTransportType);
            expect(result._id).toBe(mockId);
        });

        it('should return null when transport type not found', async () => {
            const mockId = '507f1f77bcf86cd799439011';
            Tranport.findById.mockResolvedValue(null);

            const result = await TransportTypeService.getTransportTypeById(mockId);

            expect(Tranport.findById).toHaveBeenCalledTimes(1);
            expect(Tranport.findById).toHaveBeenCalledWith(mockId);
            expect(result).toBeNull();
        });

        it('should throw error when invalid id is provided', async () => {
            const invalidId = 'invalid-id';
            const errorMessage = 'Cast to ObjectId failed';
            Tranport.findById.mockRejectedValue(new Error(errorMessage));

            await expect(TransportTypeService.getTransportTypeById(invalidId))
                .rejects
                .toThrow(errorMessage);
            expect(Tranport.findById).toHaveBeenCalledWith(invalidId);
        });
    });

    describe('createTransportType', () => {
        it('should create a new transport type', async () => {
            const mockData = {
                name: 'Air Transport',
                vehicle_number: 'TN03EF9012',
                address: '789 Airport Rd, Chennai',
                emailId: 'air@transport.com'
            };
            const mockSavedTransportType = {
                _id: '507f1f77bcf86cd799439013',
                ...mockData,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const mockSave = jest.fn().mockResolvedValue(mockSavedTransportType);
            Tranport.mockImplementation(() => ({
                save: mockSave
            }));

            const result = await TransportTypeService.createTransportType(mockData);

            expect(Tranport).toHaveBeenCalledWith(mockData);
            expect(mockSave).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockSavedTransportType);
        });

        it('should throw error when required fields are missing', async () => {
            const incompleteData = {
                name: 'Air Transport'
            };
            const errorMessage = 'Validation failed: vehicle_number is required';
            const mockSave = jest.fn().mockRejectedValue(new Error(errorMessage));
            Tranport.mockImplementation(() => ({
                save: mockSave
            }));

            await expect(TransportTypeService.createTransportType(incompleteData))
                .rejects
                .toThrow(errorMessage);
        });

        it('should throw error when duplicate vehicle number exists', async () => {
            const mockData = {
                name: 'Road Transport',
                vehicle_number: 'TN01AB1234',
                address: '123 Main St, Chennai',
                emailId: 'duplicate@transport.com'
            };
            const errorMessage = 'E11000 duplicate key error';
            const mockSave = jest.fn().mockRejectedValue(new Error(errorMessage));
            Tranport.mockImplementation(() => ({
                save: mockSave
            }));

            await expect(TransportTypeService.createTransportType(mockData))
                .rejects
                .toThrow(errorMessage);
        });

        it('should throw error when duplicate email exists', async () => {
            const mockData = {
                name: 'Rail Transport',
                vehicle_number: 'TN05GH3456',
                address: '456 Station Rd, Chennai',
                emailId: 'road@transport.com'
            };
            const errorMessage = 'E11000 duplicate key error';
            const mockSave = jest.fn().mockRejectedValue(new Error(errorMessage));
            Tranport.mockImplementation(() => ({
                save: mockSave
            }));

            await expect(TransportTypeService.createTransportType(mockData))
                .rejects
                .toThrow(errorMessage);
        });
    });

    describe('updateTransportType', () => {
        it('should update transport type and return updated document', async () => {
            const mockId = '507f1f77bcf86cd799439011';
            const updateData = {
                name: 'Updated Road Transport',
                address: '999 New Address, Chennai'
            };
            const mockUpdatedTransportType = {
                _id: mockId,
                name: 'Updated Road Transport',
                vehicle_number: 'TN01AB1234',
                address: '999 New Address, Chennai',
                emailId: 'road@transport.com',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            Tranport.findByIdAndUpdate.mockResolvedValue(mockUpdatedTransportType);

            const result = await TransportTypeService.updateTransportType(mockId, updateData);

            expect(Tranport.findByIdAndUpdate).toHaveBeenCalledTimes(1);
            expect(Tranport.findByIdAndUpdate).toHaveBeenCalledWith(mockId, updateData, { new: true });
            expect(result).toEqual(mockUpdatedTransportType);
            expect(result.name).toBe('Updated Road Transport');
            expect(result.address).toBe('999 New Address, Chennai');
        });

        it('should return null when transport type to update not found', async () => {
            const mockId = '507f1f77bcf86cd799439011';
            const updateData = { name: 'Updated Name' };
            Tranport.findByIdAndUpdate.mockResolvedValue(null);

            const result = await TransportTypeService.updateTransportType(mockId, updateData);

            expect(Tranport.findByIdAndUpdate).toHaveBeenCalledWith(mockId, updateData, { new: true });
            expect(result).toBeNull();
        });

        it('should throw error when updating with duplicate vehicle number', async () => {
            const mockId = '507f1f77bcf86cd799439011';
            const updateData = { vehicle_number: 'TN02CD5678' };
            const errorMessage = 'E11000 duplicate key error';
            Tranport.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

            await expect(TransportTypeService.updateTransportType(mockId, updateData))
                .rejects
                .toThrow(errorMessage);
        });

        it('should throw error when updating with duplicate email', async () => {
            const mockId = '507f1f77bcf86cd799439011';
            const updateData = { emailId: 'rail@transport.com' };
            const errorMessage = 'E11000 duplicate key error';
            Tranport.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

            await expect(TransportTypeService.updateTransportType(mockId, updateData))
                .rejects
                .toThrow(errorMessage);
        });

        it('should update only provided fields', async () => {
            const mockId = '507f1f77bcf86cd799439011';
            const updateData = { name: 'Partially Updated' };
            const mockUpdatedTransportType = {
                _id: mockId,
                name: 'Partially Updated',
                vehicle_number: 'TN01AB1234',
                address: '123 Main St, Chennai',
                emailId: 'road@transport.com',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            Tranport.findByIdAndUpdate.mockResolvedValue(mockUpdatedTransportType);

            const result = await TransportTypeService.updateTransportType(mockId, updateData);

            expect(result.name).toBe('Partially Updated');
            expect(result.vehicle_number).toBe('TN01AB1234');
            expect(result.emailId).toBe('road@transport.com');
        });
    });

    describe('deleteTransportType', () => {
        it('should delete transport type and return deleted document', async () => {
            const mockId = '507f1f77bcf86cd799439011';
            const mockDeletedTransportType = {
                _id: mockId,
                name: 'Road Transport',
                vehicle_number: 'TN01AB1234',
                address: '123 Main St, Chennai',
                emailId: 'road@transport.com',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            Tranport.findByIdAndDelete.mockResolvedValue(mockDeletedTransportType);

            const result = await TransportTypeService.deleteTransportType(mockId);

            expect(Tranport.findByIdAndDelete).toHaveBeenCalledTimes(1);
            expect(Tranport.findByIdAndDelete).toHaveBeenCalledWith(mockId);
            expect(result).toEqual(mockDeletedTransportType);
        });

        it('should return null when transport type to delete not found', async () => {
            const mockId = '507f1f77bcf86cd799439011';
            Tranport.findByIdAndDelete.mockResolvedValue(null);

            const result = await TransportTypeService.deleteTransportType(mockId);

            expect(Tranport.findByIdAndDelete).toHaveBeenCalledWith(mockId);
            expect(result).toBeNull();
        });

        it('should throw error when invalid id is provided', async () => {
            const invalidId = 'invalid-id';
            const errorMessage = 'Cast to ObjectId failed';
            Tranport.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));

            await expect(TransportTypeService.deleteTransportType(invalidId))
                .rejects
                .toThrow(errorMessage);
            expect(Tranport.findByIdAndDelete).toHaveBeenCalledWith(invalidId);
        });

        it('should throw error when database operation fails', async () => {
            const mockId = '507f1f77bcf86cd799439011';
            const errorMessage = 'Database connection lost';
            Tranport.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));

            await expect(TransportTypeService.deleteTransportType(mockId))
                .rejects
                .toThrow(errorMessage);
        });
    });

    describe('Integration scenarios', () => {
        it('should handle multiple operations in sequence', async () => {
            const createData = {
                name: 'Sea Transport',
                vehicle_number: 'TN06IJ7890',
                address: '321 Port Rd, Chennai',
                emailId: 'sea@transport.com'
            };
            const createdId = '507f1f77bcf86cd799439014';
            const mockCreated = { _id: createdId, ...createData };
            const updateData = { name: 'Ocean Transport' };
            const mockUpdated = { ...mockCreated, name: 'Ocean Transport' };

            const mockSave = jest.fn().mockResolvedValue(mockCreated);
            Tranport.mockImplementation(() => ({ save: mockSave }));
            Tranport.findByIdAndUpdate.mockResolvedValue(mockUpdated);
            Tranport.findByIdAndDelete.mockResolvedValue(mockUpdated);

            const created = await TransportTypeService.createTransportType(createData);
            const updated = await TransportTypeService.updateTransportType(createdId, updateData);
            const deleted = await TransportTypeService.deleteTransportType(createdId);

            expect(created._id).toBe(createdId);
            expect(updated.name).toBe('Ocean Transport');
            expect(deleted._id).toBe(createdId);
        });
    });
});
