// testUpsert.js
const typesenseClient = require('../../config/typesenseClient');
const vehicle = {
  id: '11', // Use the ID of the vehicle you're trying to upsert
  name: 'G3T6 Red',
  price: 1,
  description: 'red colored G3T6 with Turbo charged',
  quantity: 1,
  image: [
    'http://192.168.10.28:9000/your-bucket-name/b731aa43-8c9d-4c4c-a36f-ae0fd4e2fdcd.svg'
  ],
  modelId: 17,
  model: 'G3T6',
  type: 'HATCH_BACK',
  manufacture: 'Ford',
  // createdAt: 2024-10-03T08:29:20.524Z,
  // updatedAt: 2024-10-03T08:29:20.524Z
};

async function testUpsert() {
  try {
    await typesenseClient.collections('vehicles').documents(vehicle.id).update(vehicle);
    console.log('Vehicle updated successfully');
  } catch (error) {
    if (error.httpStatus === 404) {
      // If not found, create it
      await typesenseClient.collections('vehicles').documents().create(vehicle);
      console.log('Vehicle created successfully');
    } else {
      console.error('Error during test upsert to Typesense:', error);
    }
  }
}

testUpsert();
