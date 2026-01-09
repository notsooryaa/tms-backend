const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");

const uploadXLSX = async (req, res, next) => {
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
    let weightArr = [];
    let volumeArr = [];
    let quantityArr = [];

    jsonData.forEach((item) => {
      sourceArr.push(item.src);
      destinationArr.push(item.des);
      materialArr.push(item.material);
      orderNumberArr.push(item.orderNumber);
      weightArr.push(item.weight);
      volumeArr.push(item.volume);
      quantityArr.push(item.quantity);
    });
    
    return {
      source: sourceArr,
      destination: destinationArr,
      transportType: "6960a1df44fa99b87e7125a0",
      vehicleType: "6960a8f0b390967482e6160a",
      material: materialArr,
      orderNumber: orderNumberArr,
      weight: weightArr,
      volume: volumeArr,
      quantity: quantityArr,
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
        material: data.material,
        orderNumber: data.orderNumber,
        weight: data.weight,
        volume: data.volume,
        quantity: data.quantity,
        groupId: data.groupId
    };
};

module.exports = {createShipmentData, uploadXLSX};