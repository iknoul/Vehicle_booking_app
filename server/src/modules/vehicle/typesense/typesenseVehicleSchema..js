// src/modules/vehicle/schemas/vehicleSchema.js

const typeSenseVehicleSchema = {
    name: "vehicles",
    fields: [
      { name: "id", type: "int32", facet: false },
      { name: "name", type: "string", facet: false },
      { name: "price", type: "float", facet: false },
      { name: "description", type: "string", facet: false },
      { name: "quantity", type: "int32", facet: false },
      { name: "image", type: "string[]", facet: false },
      { name: "modelId", type: "int32", facet: false },
      { name: "model", type: "string", facet: false},
      { name: "type", type: "string", facet: false},
      { name: "manufacture", type: "string", facet: false}, 
    ],
    default_sorting_field: ""
  };
  
  module.exports = typeSenseVehicleSchema;
  