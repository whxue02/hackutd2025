import { Car } from "../types/car";

export const carData: Car[] = [
  {
    id: "1",
    make: "Toyota",
    model: "4Runner",
    year: 2020,
    category: "SUV",
    image: "http://127.0.0.1:5000/images/b8187e469a4b44949114cf4e99cf10e1.jpeg",
    specs: {
      engine: "4L V6",
      horsepower: 270,
      transmission: "Single-Speed",
      drivetrain: "REAR WHEEL DRIVE"
    },
    safetyRating: 4,
    gasMileage: {
      city: 17,
      highway: 22
    },
    financing: {
      msrp: 40240,
      monthlyPayment: 599,
      apr: 5.49
    }
  },
  {
    id: "2",
    make: "Toyota",
    model: "Camry",
    year: 2024,
    category: "Sedan",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
    specs: {
      engine: "2.5L 4-Cylinder",
      horsepower: 203,
      transmission: "8-Speed Automatic",
      drivetrain: "FWD"
    },
    safetyRating: 5,
    gasMileage: {
      city: 28,
      highway: 39
    },
    financing: {
      msrp: 28855,
      monthlyPayment: 429,
      apr: 4.99
    }
  },
  {
    id: "3",
    make: "Toyota",
    model: "4Runner",
    year: 2020,
    category: "SUV",
    image: "http://127.0.0.1:5000/images/6f2aa65a2ef440bf9f39997bada1575b.jpeg",
    specs: {
      engine: "3.5L V6 EcoBoost",
      horsepower: 400,
      transmission: "10-Speed Automatic",
      drivetrain: "4WD"
    },
    safetyRating: 4,
    gasMileage: {
      city: 19,
      highway: 24
    },
    financing: {
      msrp: 54370,
      monthlyPayment: 809,
      apr: 5.99
    }
  },
  {
    id: "4",
    make: "Toyota",
    model: "Camry",
    year: 2024,
    category: "Sedan",
    image: "http://127.0.0.1:5000/images/c77336b80c984ed0a4f7913c5222adef.jpeg",
    specs: {
      engine: "1.5L Turbo 4-Cylinder",
      horsepower: 190,
      transmission: "CVT",
      drivetrain: "AWD"
    },
    safetyRating: 5,
    gasMileage: {
      city: 28,
      highway: 34
    },
    financing: {
      msrp: 33550,
      monthlyPayment: 499,
      apr: 4.49
    }
  },
  {
    id: "5",
    make: "Toyota",
    model: "Land Cruiser",
    year: 2020,
    category: "SUV",
    image: "http://127.0.0.1:5000/images/99c54f9099144857b99159ce416f8fdf.jpeg",
    specs: {
      engine: "2.0L Turbo 4-Cylinder",
      horsepower: 255,
      transmission: "8-Speed Automatic",
      drivetrain: "RWD"
    },
    safetyRating: 5,
    gasMileage: {
      city: 26,
      highway: 36
    },
    financing: {
      msrp: 43800,
      monthlyPayment: 651,
      apr: 5.49
    }
  }
];

export const categories = ["All", "Sedan", "SUV", "Truck", "Electric", "Luxury", "Sports", "Wagon"];