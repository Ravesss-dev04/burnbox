export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  email: string;
  image: string;
  hours: string;
  isOpen: boolean; // This could be dynamic logic
}

export const branches: Branch[] = [
  {
    id: 'bf-resort',
    name: 'BF Resort Branch',
    address: 'Unit 109, 17 Vatican Bldg., Vatican City Dr.',
    city: 'BF Resort Village, Las Piñas City',
    coordinates: {
      lat: 14.428425252312016,
      lng: 120.98849405250161
    },
    phone: '(02) 7007 2416',
    email: 'burnboxprinting@gmail.com',
    image: '/aboutusimage.png', // Using existing image as placeholder
    hours: 'Mon - Sunday, 9:00 am - 6:00 PM',
    isOpen: true
  },
  {
    id: 'main-office',
    name: 'Main Office (Sample)',
    address: 'Alabang-Zapote Road',
    city: 'Las Piñas City',
    coordinates: {
      lat: 14.4445,
      lng: 120.9939
    },
    phone: '(02) 8888 1234',
    email: 'admin@burnbox.com',
    image: '/aboutusimage.png',
    hours: 'Mon - Fri, 8:00 am - 5:00 PM',
    isOpen: true
  }
];
