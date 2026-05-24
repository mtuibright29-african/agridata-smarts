const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment from backend/.env.txt
dotenv.config({ path: path.resolve(__dirname, '../backend/.env.txt') });

const User = require(path.resolve(__dirname, '../backend/models/User'));
const FarmData = require(path.resolve(__dirname, '../backend/models/FarmData'));

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agridata';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 30000 });

    console.log('Connected to MongoDB', mongoUri);

    let adminExists;
    try {
      adminExists = await User.findOne({ phoneNumber: '+255600000001' });
    } catch (e) {
      console.warn('Model findOne failed, will fallback to raw collection for admin check:', e.message);
      adminExists = await mongoose.connection.db.collection('users').findOne({ phoneNumber: '+255600000001' });
    }
    if (!adminExists) {
      try {
        await User.create({
          name: 'Admin AgriData',
          phoneNumber: '+255600000001',
          password: 'AdminPass123',
          role: 'admin',
          location: { region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Mikocheni' }
        });
        console.log('Created admin user');
      } catch (e) {
        console.warn('Model create failed for admin, inserting raw document:', e.message);
        await mongoose.connection.db.collection('users').insertOne({
          name: 'Admin AgriData',
          phoneNumber: '+255600000001',
          password: 'AdminPass123',
          role: 'admin',
          location: { region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Mikocheni' },
          createdAt: new Date()
        });
        console.log('Inserted admin user via raw collection');
      }
    }

    let farmerExists;
    try {
      farmerExists = await User.findOne({ phoneNumber: '+255600000002' });
    } catch (e) {
      console.warn('Model findOne failed, will fallback to raw collection for farmer check:', e.message);
      farmerExists = await mongoose.connection.db.collection('users').findOne({ phoneNumber: '+255600000002' });
    }
    if (!farmerExists) {
      let farmer;
      try {
        farmer = await User.create({
          name: 'Juma Mwinyi',
          phoneNumber: '+255600000002',
          password: 'FarmerPass123',
          role: 'farmer',
          location: { region: 'Pwani', district: 'Chalinze', ward: 'Bungu' },
          farmSize: 2.5,
          crops: [
            { cropType: 'Mananasi', plantingDate: new Date('2026-01-15'), expectedHarvest: new Date('2026-06-15') }
          ]
        });
      } catch (e) {
        console.warn('Model create failed for farmer, inserting raw document:', e.message);
        const res = await mongoose.connection.db.collection('users').insertOne({
          name: 'Juma Mwinyi',
          phoneNumber: '+255600000002',
          password: 'FarmerPass123',
          role: 'farmer',
          location: { region: 'Pwani', district: 'Chalinze', ward: 'Bungu' },
          farmSize: 2.5,
          crops: [ { cropType: 'Mananasi', plantingDate: new Date('2026-01-15'), expectedHarvest: new Date('2026-06-15') } ],
          createdAt: new Date()
        });
        farmer = { _id: res.insertedId };
      }

      try {
        await FarmData.create({
          farmerId: farmer._id,
          cropType: 'Mananasi',
          plantingDate: new Date('2026-01-15'),
          harvestDate: new Date('2026-06-15'),
          yieldKg: 850,
          soilMoisture: 45,
          soilPH: 6.2,
          temperature: 28,
          rainfall: 120,
          pricePerKg: 2500,
          diseaseDetected: 'Hakuna ugonjwa uliogunduliwa',
          aiAnalysis: {
            healthScore: 87,
            recommendations: ['Endelea kumwagilia asubuhi', 'Tumia mbolea yenye nitrojeni', 'Fuatilia ukuaji kwa wiki'],
            riskLevel: 'Low'
          }
        });
        console.log('Created farmer user and farm data');
      } catch (e) {
        console.warn('Failed to create FarmData via model, inserting raw document:', e.message);
        await mongoose.connection.db.collection('farmdatas').insertOne({
          farmerId: farmer._id,
          cropType: 'Mananasi',
          plantingDate: new Date('2026-01-15'),
          harvestDate: new Date('2026-06-15'),
          yieldKg: 850,
          soilMoisture: 45,
          soilPH: 6.2,
          temperature: 28,
          rainfall: 120,
          pricePerKg: 2500,
          diseaseDetected: 'Hakuna ugonjwa uliogunduliwa',
          aiAnalysis: {
            healthScore: 87,
            recommendations: ['Endelea kumwagilia asubuhi', 'Tumia mbolea yenye nitrojeni', 'Fuatilia ukuaji kwa wiki'],
            riskLevel: 'Low'
          },
          createdAt: new Date()
        });
        console.log('Inserted farm data via raw collection');
      }
    }

    let buyerExists;
    try {
      buyerExists = await User.findOne({ phoneNumber: '+255600000003' });
    } catch (e) {
      console.warn('Model findOne failed, will fallback to raw collection for buyer check:', e.message);
      buyerExists = await mongoose.connection.db.collection('users').findOne({ phoneNumber: '+255600000003' });
    }
    if (!buyerExists) {
      try {
        await User.create({
          name: 'Asha Mbuyu',
          phoneNumber: '+255600000003',
          password: 'BuyerPass123',
          role: 'buyer',
          location: { region: 'Morogoro', district: 'Kilosa', ward: 'Kimamba' }
        });
        console.log('Created buyer user');
      } catch (e) {
        console.warn('Model create failed for buyer, inserting raw document:', e.message);
        await mongoose.connection.db.collection('users').insertOne({
          name: 'Asha Mbuyu',
          phoneNumber: '+255600000003',
          password: 'BuyerPass123',
          role: 'buyer',
          location: { region: 'Morogoro', district: 'Kilosa', ward: 'Kimamba' },
          createdAt: new Date()
        });
        console.log('Inserted buyer user via raw collection');
      }
    }

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
