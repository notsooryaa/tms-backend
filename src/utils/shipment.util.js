const XLSX = require("xlsx");

const uploadXLSX = async (req, res) => {
  try {
    let path = req.file.path;
    var workbook = XLSX.readFile(path);
    var sheet_name_list = workbook.SheetNames;
    let jsonData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );
    let sourceArr = [];
    let destinationArr = [];
    let materialArr = [];
    let orderNumberArr = [];

    jsonData.forEach((item) => {
      sourceArr.push(item.src);
      destinationArr.push(item.des);
      
      const materialNames = item.materialName.toString().split(',').map(name => name.trim());
      const quantities = item.quantity.toString().split(',').map(qty => qty.trim());
      
      const materialList = materialNames.map((materialName, index) => ({
        materialName: materialName,
        quantity: quantities[index] || quantities[0]
      }));
      
      materialArr.push(materialList);
      
      orderNumberArr.push(item.orderNumber);
    });

    console.log(materialArr)
    
    return {
      source: sourceArr,
      destination: destinationArr,
      transportType: req.body.transportType,
      vehicleType: req.body.vehicleType,
      materials: materialArr,
      orderNumber: orderNumberArr,
      groupId: jsonData[0].groupId,
    };
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

function createShipmentData(data) {
  if (!data) {
    throw new Error('Invalid order data');
  }
    return {
        transportType: data.transportType,
        vehicleType: data.vehicleType,
        materials: data.materials,
        groupId: data.groupId
    };
};

module.exports = {createShipmentData, uploadXLSX};