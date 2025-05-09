const { validationResult } = require("express-validator");
const BuildingRule = require("../models/BuildingRule");
const path = require("path");
const fs = require("fs");

// Create new building rule
const createRule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cityName, pincode, rules } = req.body;
    const documentPath = req.file ? req.file.path : null;

    const buildingRule = new BuildingRule({
      cityName,
      pincode,
      rules,
      documentPath,
    });

    await buildingRule.save();
    res.status(201).json(buildingRule);
  } catch (error) {
    console.error("Error creating building rule:", error);
    res.status(500).json({ message: "Error creating building rule" });
  }
};

// Get all building rules
const getAllRules = async (req, res) => {
  try {
    const rules = await BuildingRule.find();
    res.json(rules);
  } catch (error) {
    console.error("Error fetching rules:", error);
    res.status(500).json({ message: "Error fetching rules" });
  }
};

// Get rules by city
const getRulesByCity = async (req, res) => {
  try {
    const { cityName } = req.params;
    const rules = await BuildingRule.find({ cityName });
    res.json(rules);
  } catch (error) {
    console.error("Error fetching rules by city:", error);
    res.status(500).json({ message: "Error fetching rules" });
  }
};

// Get rules by pincode
const getRulesByPincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    const rules = await BuildingRule.find({ pincode });
    res.json(rules);
  } catch (error) {
    console.error("Error fetching rules by pincode:", error);
    res.status(500).json({ message: "Error fetching rules" });
  }
};

// Get cities and pincodes
const getCitiesAndPincodes = async (req, res) => {
  try {
    const cities = await BuildingRule.distinct("cityName");
    const pincodes = await BuildingRule.distinct("pincode");
    res.json({ cities, pincodes });
  } catch (error) {
    console.error("Error fetching cities and pincodes:", error);
    res.status(500).json({ message: "Error fetching cities and pincodes" });
  }
};

// Update building rule
const updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) {
      updates.documentPath = req.file.path;
    }

    const rule = await BuildingRule.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!rule) {
      return res.status(404).json({ message: "Building rule not found" });
    }
    res.json(rule);
  } catch (error) {
    console.error("Error updating building rule:", error);
    res.status(500).json({ message: "Error updating building rule" });
  }
};

// Delete building rule
const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await BuildingRule.findByIdAndDelete(id);
    if (!rule) {
      return res.status(404).json({ message: "Building rule not found" });
    }
    res.json({ message: "Building rule deleted successfully" });
  } catch (error) {
    console.error("Error deleting building rule:", error);
    res.status(500).json({ message: "Error deleting building rule" });
  }
};

// Get document file
const getDocumentFile = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await BuildingRule.findById(id);
    if (!rule || !rule.documentPath) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.sendFile(path.resolve(rule.documentPath));
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ message: "Error retrieving document" });
  }
};

module.exports = {
  createRule,
  getAllRules,
  getRulesByCity,
  getRulesByPincode,
  getCitiesAndPincodes,
  updateRule,
  deleteRule,
  getDocumentFile,
};
