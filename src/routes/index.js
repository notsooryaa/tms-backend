const express = require('express');
const router = express.Router();
const transportTypeRoute = require('./transportType.route');
const vechicleTypeRoute = require('./vechicleType.route');
const materialRoute = require('./material.route');
const materialCategoryRoute = require('./materialCategory.route');
const shipmentRoute = require('./shipment.route');

router.use('/transport-types', transportTypeRoute);
router.use('/vechicle-types', vechicleTypeRoute);
router.use('/materials', materialRoute);
router.use('/material-categories', materialCategoryRoute);
router.use('/shipments', shipmentRoute);

module.exports = router;
