import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const cars = [
  {
    name: 'Maruti Suzuki Swift',
    brand: 'Maruti Suzuki',
    category: 'Hatchback',
    segment: 'Standard',
    price: 1300,
    image: '/images/cars/swift.png',
    seats: 5,
    transmission: 'Manual',
    fuel: 'Petrol',
    mileage: '24.8 kmpl',
    rating: 4.5,
    reviewsCount: 128,
    available: true,
    color: 'Pearl Arctic White',
    year: 2024,
    ac: true,
    brandLogo: 'MS',
    brandColor: '#003087',
    description: "India's best-selling hatchback. Perfect for city commutes."
  },
  {
    name: 'Hyundai i20',
    brand: 'Hyundai',
    category: 'Hatchback',
    segment: 'Standard',
    price: 1500,
    image: '/images/cars/i20.png',
    seats: 5,
    transmission: 'Manual',
    fuel: 'Petrol',
    mileage: '20.35 kmpl',
    rating: 4.5,
    reviewsCount: 94,
    available: true,
    color: 'Titan Grey',
    year: 2024,
    ac: true,
    brandLogo: 'HY',
    brandColor: '#002C5F',
    description: 'Premium hatchback with turbocharged performance.'
  },
  {
    name: 'Tata Altroz',
    brand: 'Tata',
    category: 'Hatchback',
    segment: 'Standard',
    price: 1600,
    image: '/images/cars/altroz.png',
    seats: 5,
    transmission: 'Manual',
    fuel: 'Petrol',
    mileage: '19.99 kmpl',
    rating: 4.4,
    reviewsCount: 76,
    available: true,
    color: 'Avenue Blue',
    year: 2024,
    ac: true,
    brandLogo: 'TT',
    brandColor: '#00539B',
    description: '5-star safety rated premium hatchback from Tata.'
  },
  {
    name: 'Maruti Suzuki Dzire',
    brand: 'Maruti Suzuki',
    category: 'Sedan',
    segment: 'Standard',
    price: 1800,
    image: '/images/cars/dzire.png',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'CNG',
    mileage: '31.12 km/kg',
    rating: 4.6,
    reviewsCount: 142,
    available: true,
    color: 'Pearl Arctic White',
    year: 2024,
    ac: true,
    brandLogo: 'MS',
    brandColor: '#003087',
    description: "India's most loved compact sedan with best-in-class mileage."
  },
  {
    name: 'Honda City',
    brand: 'Honda',
    category: 'Sedan',
    segment: 'Standard',
    price: 2000,
    image: '/images/cars/honda-city.png',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: '18.4 kmpl',
    rating: 4.6,
    reviewsCount: 163,
    available: true,
    color: 'Lunar Silver Metallic',
    year: 2024,
    ac: true,
    brandLogo: 'HO',
    brandColor: '#CC0000',
    description: 'The iconic premium sedan with refined driving experience.'
  },
  {
    name: 'Hyundai Verna',
    brand: 'Hyundai',
    category: 'Sedan',
    segment: 'Standard',
    price: 2200,
    image: '/images/cars/verna.png',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: '20.6 kmpl',
    rating: 4.7,
    reviewsCount: 118,
    available: true,
    color: 'Abyss Black Pearl',
    year: 2024,
    ac: true,
    brandLogo: 'HY',
    brandColor: '#002C5F',
    description: 'All-new premium sedan with Level 2 ADAS technology.'
  },
  {
    name: 'Mahindra Thar',
    brand: 'Mahindra',
    category: 'SUV',
    segment: 'Standard',
    price: 3500,
    image: '/images/cars/thar.png',
    seats: 4,
    transmission: 'Manual',
    fuel: 'Diesel',
    mileage: '15.2 kmpl',
    rating: 4.8,
    reviewsCount: 210,
    available: true,
    color: 'Napoli Black',
    year: 2024,
    ac: true,
    brandLogo: 'MH',
    brandColor: '#C41E3A',
    description: 'Iconic off-roader. Built for adventure, loved by India.'
  },
  {
    name: 'Hyundai Creta',
    brand: 'Hyundai',
    category: 'SUV',
    segment: 'Standard',
    price: 2400,
    image: '/images/cars/creta.png',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Diesel',
    mileage: '18.4 kmpl',
    rating: 4.7,
    reviewsCount: 256,
    available: true,
    color: 'Atlas White',
    year: 2024,
    ac: true,
    brandLogo: 'HY',
    brandColor: '#002C5F',
    description: "India's #1 SUV with panoramic sunroof and ADAS."
  },
  {
    name: 'Kia Seltos',
    brand: 'Kia',
    category: 'SUV',
    segment: 'Standard',
    price: 2600,
    image: '/images/cars/seltos.png',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: '16.5 kmpl',
    rating: 4.6,
    reviewsCount: 178,
    available: true,
    color: 'Clear White',
    year: 2024,
    ac: true,
    brandLogo: 'KI',
    brandColor: '#05141F',
    description: 'Feature-loaded SUV with Meridian audio and HUD.'
  },
  {
    name: 'Mahindra Scorpio-N',
    brand: 'Mahindra',
    category: 'SUV',
    segment: 'Standard',
    price: 3800,
    image: '/images/cars/scorpio.png',
    seats: 7,
    transmission: 'Manual',
    fuel: 'Diesel',
    mileage: '13.9 kmpl',
    rating: 4.7,
    reviewsCount: 195,
    available: true,
    color: 'Dazzling Silver',
    year: 2024,
    ac: true,
    brandLogo: 'MH',
    brandColor: '#C41E3A',
    description: 'The legendary Scorpio reborn. Big, bold, and powerful.'
  },
  {
    name: 'Toyota Innova Crysta',
    brand: 'Toyota',
    category: 'MUV',
    segment: 'Standard',
    price: 4000,
    image: '/images/cars/innova.png',
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Diesel',
    mileage: '14.3 kmpl',
    rating: 4.9,
    reviewsCount: 312,
    available: true,
    color: 'Super White',
    year: 2024,
    ac: true,
    brandLogo: 'TO',
    brandColor: '#EB0A1E',
    description: "India's most trusted family MUV for 20+ years."
  },
  {
    name: 'Maruti Suzuki Ertiga',
    brand: 'Maruti Suzuki',
    category: 'MUV',
    segment: 'Standard',
    price: 2800,
    image: '/images/cars/ertiga.png',
    seats: 7,
    transmission: 'Manual',
    fuel: 'CNG',
    mileage: '26.11 km/kg',
    rating: 4.5,
    reviewsCount: 134,
    available: true,
    color: 'Premium Silver',
    year: 2024,
    ac: true,
    brandLogo: 'MS',
    brandColor: '#003087',
    description: 'Best-value 7-seater MUV with class-leading CNG mileage.'
  },
  {
    name: 'Mahindra XUV700',
    brand: 'Mahindra',
    category: 'Premium SUV',
    segment: 'Standard',
    price: 3500,
    image: '/images/cars/xuv700.png',
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Diesel',
    mileage: '16.3 kmpl',
    rating: 4.8,
    reviewsCount: 221,
    available: true,
    color: 'Everest White',
    year: 2024,
    ac: true,
    brandLogo: 'MH',
    brandColor: '#C41E3A',
    description: 'World-class SUV with ADAS & AI-powered cockpit at Indian price.'
  },
  {
    name: 'Tata Nexon',
    brand: 'Tata',
    category: 'SUV',
    segment: 'Standard',
    price: 2000,
    image: '/images/cars/nexon.png',
    seats: 5,
    transmission: 'Manual',
    fuel: 'Petrol',
    mileage: '17.0 kmpl',
    rating: 4.6,
    reviewsCount: 189,
    available: true,
    color: 'Vivid Blue',
    year: 2024,
    ac: true,
    brandLogo: 'TT',
    brandColor: '#00539B',
    description: "India's first 5-star safety rated compact SUV."
  },
  {
    name: 'Toyota Fortuner',
    brand: 'Toyota',
    category: 'Premium SUV',
    segment: 'Standard',
    price: 6500,
    image: '/images/cars/fortuner.png',
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Diesel',
    mileage: '14.0 kmpl',
    rating: 4.9,
    reviewsCount: 287,
    available: true,
    color: 'Super White',
    year: 2024,
    ac: true,
    brandLogo: 'TO',
    brandColor: '#EB0A1E',
    description: 'The undisputed king of Indian SUVs. Power meets prestige.'
  },
  {
    name: 'Mercedes-Benz E-Class',
    brand: 'Mercedes-Benz',
    category: 'Luxury Sedan',
    segment: 'Luxury',
    price: 12000,
    image: '/images/cars/mercedes.png',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: '12.2 kmpl',
    rating: 4.9,
    reviewsCount: 89,
    available: true,
    color: 'Diamond White',
    year: 2024,
    ac: true,
    brandLogo: 'MB',
    brandColor: '#00A19C',
    description: 'The pinnacle of executive luxury. Arrive in pure elegance.'
  },
  {
    name: 'BMW 5 Series',
    brand: 'BMW',
    category: 'Luxury Sedan',
    segment: 'Luxury',
    price: 13500,
    image: '/images/cars/bmw.png',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: '11.8 kmpl',
    rating: 4.9,
    reviewsCount: 74,
    available: true,
    color: 'Champagne Quartz',
    year: 2024,
    ac: true,
    brandLogo: 'BM',
    brandColor: '#1C69D4',
    description: 'The ultimate driving machine. Sporty luxury at its finest.'
  },
  {
    name: 'Audi A6',
    brand: 'Audi',
    category: 'Luxury Sedan',
    segment: 'Luxury',
    price: 14000,
    image: '/images/cars/audi.png',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: '11.5 kmpl',
    rating: 4.8,
    reviewsCount: 67,
    available: true,
    color: 'Floret Silver',
    year: 2024,
    ac: true,
    brandLogo: 'AU',
    brandColor: '#BB0A14',
    description: 'German engineering perfection. Quattro AWD precision.'
  },
  {
    name: 'Jaguar XF',
    brand: 'Jaguar',
    category: 'Luxury Sedan',
    segment: 'Luxury',
    price: 15000,
    image: '/images/cars/jaguar.png',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: '10.9 kmpl',
    rating: 4.8,
    reviewsCount: 52,
    available: true,
    color: 'Santorini Black',
    year: 2024,
    ac: true,
    brandLogo: 'JG',
    brandColor: '#2D2D2D',
    description: 'British luxury meets athletic performance. Purely exquisite.'
  },
  {
    name: 'Range Rover Velar',
    brand: 'Land Rover',
    category: 'Luxury SUV',
    segment: 'Luxury',
    price: 18000,
    image: '/images/cars/velar.png',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: '10.2 kmpl',
    rating: 4.9,
    reviewsCount: 61,
    available: true,
    color: 'Fuji White',
    year: 2024,
    ac: true,
    brandLogo: 'RR',
    brandColor: '#005A2B',
    description: 'The most desirable Range Rover. Unmatched luxury & off-road.'
  },
  {
    name: 'Mahindra Bolero Neo',
    brand: 'Mahindra',
    category: 'SUV',
    segment: 'Standard',
    price: 2200,
    image: '/images/cars/bolero.png',
    seats: 7,
    transmission: 'Manual',
    fuel: 'Diesel',
    mileage: '17.29 kmpl',
    rating: 4.4,
    reviewsCount: 88,
    available: true,
    color: 'Rocky Beige',
    year: 2024,
    ac: true,
    brandLogo: 'MH',
    brandColor: '#C41E3A',
    description: 'The tough and authentic Indian SUV. Perfect for any terrain.'
  },
  {
    name: 'Maruti Suzuki Baleno',
    brand: 'Maruti Suzuki',
    category: 'Hatchback',
    segment: 'Standard',
    price: 1600,
    image: '/images/cars/baleno.png',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    mileage: '22.94 kmpl',
    rating: 4.6,
    reviewsCount: 145,
    available: true,
    color: 'Nexa Blue',
    year: 2024,
    ac: true,
    brandLogo: 'MS',
    brandColor: '#003087',
    description: 'Premium hatchback experience with high tech features and comfort.'
  },
  {
    name: 'Toyota Innova Hycross',
    brand: 'Toyota',
    category: 'MUV',
    segment: 'Luxury',
    price: 5500,
    image: '/images/cars/hycross.png',
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Hybrid',
    mileage: '23.24 kmpl',
    rating: 4.9,
    reviewsCount: 112,
    available: true,
    color: 'Blackish Ageha Glass Flake',
    year: 2024,
    ac: true,
    brandLogo: 'TO',
    brandColor: '#EB0A1E',
    description: 'The new age MUV. Hybrid technology meets luxury and space.'
  }
];

async function main() {
  console.log('Start seeding...');
  
  // Clear existing data in correct order
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();
  await prisma.driver.deleteMany();

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@desirent.in',
      name: 'Admin — DesiRent',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+91 98765 43210'
    }
  });

  // Create Demo User
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.create({
    data: {
      email: 'rahul@gmail.com',
      name: 'Rahul Sharma',
      password: userPassword,
      role: 'USER',
      phone: '+91 99887 76655'
    }
  });
  
  for (const car of cars) {
    const createdCar = await prisma.car.create({
      data: {
        ...car,
        odometer: Math.floor(Math.random() * 6000), // Some cars will need service (>5000)
        lastServiceKm: 0,
        nextServiceKm: 5000,
        lastServiceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      },
    });
    console.log(`Created car: ${createdCar.name}`);
  }

  // Create Drivers
  await prisma.driver.createMany({
    data: [
      { name: 'Amit Kumar', phone: '+91 98989 89898', licenseNo: 'DL-2024-AMIT', status: 'AVAILABLE' },
      { name: 'Sanjay Singh', phone: '+91 97979 79797', licenseNo: 'DL-2024-SANJ', status: 'AVAILABLE' }
    ]
  });

  // Create some maintenance records for one car
  const firstCar = await prisma.car.findFirst();
  if (firstCar) {
    await prisma.maintenance.create({
      data: {
        carId: firstCar.id,
        serviceType: 'Routine Oil Change',
        notes: 'Monthly maintenance completed',
        status: 'COMPLETED',
        cost: 2500
      }
    });
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
