require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

const sampleUsers = [
  {
    name: 'Amit Kumar',
    email: 'amit@example.com',
    password: 'password123',
    phone: '+91-9876543210',
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139], // Delhi
      address: 'Connaught Place',
      city: 'New Delhi',
      pincode: '110001'
    }
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    phone: '+91-9876543211',
    location: {
      type: 'Point',
      coordinates: [77.2167, 28.6200], // Near Delhi
      address: 'Karol Bagh',
      city: 'New Delhi',
      pincode: '110005'
    }
  },
  {
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    password: 'password123',
    phone: '+91-9876543212',
    location: {
      type: 'Point',
      coordinates: [77.2295, 28.6358], // Near Delhi
      address: 'Rohini',
      city: 'New Delhi',
      pincode: '110085'
    }
  },
  {
    name: 'Sneha Patel',
    email: 'sneha@example.com',
    password: 'password123',
    phone: '+91-9876543213',
    location: {
      type: 'Point',
      coordinates: [77.1025, 28.7041], // Delhi NCR
      address: 'Dwarka',
      city: 'New Delhi',
      pincode: '110075'
    }
  }
];

const sampleBooks = [
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    description: 'A magical tale about following your dreams.',
    price: 350,
    genre: 'Fiction',
    condition: 'Good',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg'
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'Tiny changes, remarkable results.',
    price: 450,
    genre: 'Self-Help',
    condition: 'Like New',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg'
  },
  {
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel.',
    price: 300,
    genre: 'Fiction',
    condition: 'Good',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg'
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description: 'A brief history of humankind.',
    price: 500,
    genre: 'Non-Fiction',
    condition: 'New',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71lRKw82ekL.jpg'
  },
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    description: 'What the rich teach their kids about money.',
    price: 400,
    genre: 'Finance',
    condition: 'Good',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81bsw6fnAjL.jpg'
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    description: 'Timeless lessons on wealth, greed, and happiness.',
    price: 380,
    genre: 'Finance',
    condition: 'Like New',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71g2ednj0JL.jpg'
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    description: 'The first book in the Harry Potter series.',
    price: 420,
    genre: 'Fantasy',
    condition: 'Fair',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg'
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    description: 'How today\'s entrepreneurs use continuous innovation.',
    price: 460,
    genre: 'Business',
    condition: 'Good',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/81-QB7nDh4L.jpg'
  },
  {
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    description: 'The classic guide to success.',
    price: 350,
    genre: 'Self-Help',
    condition: 'Good',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71UypkUjStL.jpg'
  },
  {
    title: 'The 5 AM Club',
    author: 'Robin Sharma',
    description: 'Own your morning, elevate your life.',
    price: 390,
    genre: 'Self-Help',
    condition: 'Like New',
    coverImage: 'https://images-na.ssl-images-amazon.com/images/I/71zytzrg6lL.jpg'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Book.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.create(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create books and assign to users
    console.log('📚 Creating books...');
    const booksWithOwners = sampleBooks.map((book, index) => ({
      ...book,
      owner: createdUsers[index % createdUsers.length]._id
    }));

    const createdBooks = await Book.create(booksWithOwners);
    console.log(`✅ Created ${createdBooks.length} books`);

    // Update users' booksOwned
    for (const book of createdBooks) {
      await User.findByIdAndUpdate(book.owner, {
        $push: { booksOwned: book._id }
      });
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('----------------------------');
    sampleUsers.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('----------------------------');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
