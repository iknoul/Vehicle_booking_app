const bcrypt = require('bcrypt');
const Admin = require('../modules/admin/schema/adminModel'); // Update the path to where your Admin model is located

const seedAdmin = async () => {
    try {
        // Check if an admin already exists
        const existingAdmin = await Admin.findOne({ where: { email: 'admin@example.com' } });

        if (existingAdmin) {
            console.log('Default admin already exists.');
            return;
        }

        const salt = await bcrypt.genSalt(10); // Adjust salt rounds as necessary
        // Hash the password before saving;
        const hashedPassword = await bcrypt.hash('admin@123', salt);

        console.log(hashedPassword)
        // Create the default admin
        const admin = await Admin.create({
            name: 'Admin User',
            email: 'admin@example.com',
            mobile: '1234567890',
            password: hashedPassword,
        });

        console.log('Default admin seeded successfully:', admin);
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

// Run the seeding script
seedAdmin().then(() => {
    console.log('Seeding completed.');
    process.exit();
}).catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
});
