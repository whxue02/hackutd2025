export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  image: string;
  specs: {
    engine: string;
    horsepower: number;
    transmission: string;
    drivetrain: string;
  };
  safetyRating: number;
  gasMileage: {
    city: number;
    highway: number;
  };
  financing: {
    msrp: number;
    monthlyPayment: number;
    apr: number;
  };
}
