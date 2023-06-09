const users = [
  {
    name: "Test Admin",
    email: "test@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000000",
    role: "admin",
  },
  {
    name: "Driver 1",
    email: "driver1@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000001",
    role: "driver",
    currentLocation: {
      latitude: 4.743893,
      longitude: -74.072424,
    },
  },
  {
    name: "Driver 2",
    email: "driver2@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000002",
    role: "driver",
    currentLocation: {
      latitude: 4.730845,
      longitude: -74.058093,
    },
  },
  {
    name: "Driver 3",
    email: "driver3@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000003",
    role: "driver",
    currentLocation: {
      latitude: 4.720696,
      longitude: -74.074885,
    },
  },
  {
    name: "Driver 4",
    email: "driver4@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000004",
    role: "driver",
    currentLocation: {
      latitude: 4.731047,
      longitude: -74.035267,
    },
  },
  {
    name: "Driver 5",
    email: "driver5@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000005",
    role: "driver",
    currentLocation: {
      latitude: 4.695569,
      longitude: -74.06288,
    },
  },
  {
    name: "Driver 6",
    email: "driver6@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000006",
    role: "driver",
    currentLocation: {
      latitude: 4.661906,
      longitude: -74.06515,
    },
  },
  {
    name: "Driver 7",
    email: "driver7@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000007",
    role: "driver",
    currentLocation: {
      latitude: 4.616261,
      longitude: -74.091482,
    },
  },
  {
    name: "Driver 8",
    email: "driver8@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000008",
    role: "driver",
    currentLocation: {
      latitude: 4.677415,
      longitude: -74.127252,
    },
  },
  {
    name: "Driver 9",
    email: "driver9@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000009",
    role: "driver",
    currentLocation: {
      latitude: 4.62659,
      longitude: -74.102171,
    },
  },
  {
    name: "Rider 1",
    email: "rider1@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000010",
    role: "rider",
    currentLocation: {
      latitude: 4.672176,
      longitude: -74.071727,
    },
  },
  {
    name: "Rider 2",
    email: "rider2@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000011",
    role: "rider",
    currentLocation: {
      latitude: 4.708577,
      longitude: -74.035624,
    },
  },
  {
    name: "Rider 3",
    email: "rider3@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000012",
    role: "rider",
    currentLocation: {
      latitude: 4.68609,
      longitude: -74.06662,
    },
  },
  {
    name: "Rider 4",
    email: "rider4@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000013",
    role: "rider",
    currentLocation: {
      latitude: 4.654404,
      longitude: -74094705,
    },
  },
  {
    name: "Rider 5",
    email: "rider5@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000014",
    role: "rider",
    currentLocation: {
      latitude: 4.615192,
      longitude: -74.063149,
    },
  },
  {
    name: "Rider 6",
    email: "rider6@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000015",
    role: "rider",
    currentLocation: {
      latitude: 4.623259,
      longitude: -74.131167,
    },
  },
  {
    name: "Rider 7",
    email: "rider7@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000016",
    role: "rider",
    currentLocation: {
      latitude: 4.740555,
      longitude: -74.040856,
    },
  },
  {
    name: "Rider 8",
    email: "rider8@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000017",
    role: "rider",
    currentLocation: {
      latitude: 4.717024,
      longitude: -74.11094,
    },
  },
  {
    name: "Rider 9",
    email: "rider9@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000018",
    role: "rider",
    currentLocation: {
      latitude: 4.706867,
      longitude: -74056166,
    },
  },
  {
    name: "Rider 10",
    email: "rider10@wace.co",
    password: "123456",
    address: "Calle Test",
    phone: "3230000019",
    role: "rider",
    currentLocation: {
      latitude: 4.605831,
      longitude: -74.079264,
    },
  },
];

const tokensPaymentMethods = [
  { token: "tok_test_41329_d2a8d48B8a46e7282C0fEAa830568157", type: "CARD" },
  { token: "tok_test_41329_851880d73a14abfa1Ee05320b6F028e3", type: "CARD" },
  { token: "tok_test_41329_42280C2b5e833EacfB4257c0a4A6a027", type: "CARD" },
  { token: "nequi_test_7x0Os70ya5DHc9D4USQAKKSX8wuyYDI5", type: "NEQUI" },
  { token: "nequi_test_k1jiivjS5fZbsJRjcxTe6ugHNLFHJT38", type: "NEQUI" },
  { token: "nequi_test_yoHwetddMmhoFc3PDcmmcVHNiD2neWvX", type: "NEQUI" },
];

module.exports = {
  users,
  tokensPaymentMethods,
};
