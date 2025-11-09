import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Background from "./background2.png"; 

interface CarDetail {
  hack_id: string;
  year: number;
  make: string;
  model: string;
  submodel: string;
  trim: string;
  description: string;
  type: string;
  msrp: number;
  invoice: number;
  estimated_current_cost: number;
  expected_value_2027: number;
  img_path: string;
  
  // Engine & Performance
  engine_type: string;
  size: number;
  cylinders: string;
  horsepower_hp: number;
  horsepower_rpm: number;
  torque_ft_lbs: number;
  torque_rpm: number;
  cam_type: string;
  valve_timing: string;
  valves: number;
  
  // Fuel & Efficiency
  fuel_type: string;
  fuel_tank_capacity: number;
  epa_city_mpg: number;
  epa_highway_mpg: number;
  combined_mpg: number;
  range_city: number;
  range_highway: number;
  
  // Transmission & Drive
  transmission: string;
  drive_type: string;
  
  // Dimensions
  length: number;
  width: number;
  height: number;
  wheel_base: number;
  curb_weight: number;
  cargo_capacity: number;
  seats: number;
  doors: number;
}

export function CarDetail() {
  const { hackId } = useParams<{ hackId: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hackId) {
      fetchCarDetail(hackId);
    }
  }, [hackId]);

  const fetchCarDetail = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:5000/data/cars/${id}`);
      if (!response.ok) throw new Error('Failed to fetch car details');
      
      const data = await response.json();
      setCar(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdfdfd' }}>
        <div style={{ color: '#1a1a1a', fontSize: '20px', fontWeight: '500' }}>Loading car details...</div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdfdfd' }}>
        <div style={{ color: '#8b1538', fontSize: '20px', fontWeight: '500' }}>Error: {error || 'Car not found'}</div>
      </div>
    );
  }

  const imageUrl = car.img_path ? `http://127.0.0.1:5000/images/${car.img_path}` : '/placeholder-car.jpg';
  const avatarLetter = car.make.charAt(0).toUpperCase();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#fdfdfd',
      color: '#1a1a1a',
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      position: 'relative'
    }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.5,
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      
      <div style={{ 
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 28px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Top Bar */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fdfdfd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1a1a1a',
              fontWeight: '700',
              fontSize: '28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
            }}>
              {avatarLetter}
            </div>
            <div>
              <h1 style={{ margin: "10px 0 0 0", fontSize: '28px', color: '#1a1a1a', fontWeight: '800' }}>
                {car.hack_id} {car.model}
              </h1>
              <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>
                Model {car.year}
              </p>
            </div>
          </div>

          <button 
            onClick={() => navigate(-1)}
            style={{
              background: '#fdfdfd',
              border: '1px solid rgba(0,0,0,0.06)',
              padding: '12px 24px',
              borderRadius: '24px',
              color: '#1a1a1a',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            ← Back
          </button>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Left Rail */}
          <div style={{ 
            width: '64px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#fdfdfd',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1a1a1a',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>≡</div>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#fdfdfd',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1a1a1a',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>□</div>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#fdfdfd',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b1538',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>♡</div>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#fdfdfd',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1a1a1a',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>🔍</div>
          </div>

          {/* Hero Image */}
          <div style={{ 
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '18px 8px'
          }}>
            <div style={{
              position: 'relative',
              width: '720px',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fdfdfd',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={imageUrl}
                alt={`${car.make} ${car.model}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'contrast(1.05) saturate(1.1)'
                }}
              />
            </div>
          </div>

          {/* Right Column */}
          <aside style={{ width: '220px', paddingTop: '40px' }}>

          </aside>
        </div>

        {/* Feature Highlights */}
        <div style={{ marginTop: '36px' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#1a1a1a', fontSize: '25px', fontWeight: '800' }}>
            Feature Highlights
          </h3>
          <div style={{ 
            display: 'flex',
            gap: '18px',
            overflowX: 'auto',
            paddingBottom: '10px'
          }}>
            {/* Engine */}
            <div style={{
              background: '#fdfdfd',
              minWidth: '170px',
              padding: '18px',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ color: '#666', fontSize: '12px', fontWeight: '500' }}>Engine</div>
              <div style={{ fontWeight: '700', fontSize: '18px', color: '#1a1a1a' }}>
                {car.size}L {car.cylinders}
              </div>
              <div style={{ color: '#666', fontSize: '11px' }}>
                {car.horsepower_hp} HP @ {car.horsepower_rpm} RPM
              </div>
            </div>

            {/* MPG */}
            <div style={{
              background: '#fdfdfd',
              minWidth: '170px',
              padding: '18px',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ color: '#666', fontSize: '12px', fontWeight: '500' }}>Fuel Economy</div>
              <div style={{ fontWeight: '700', fontSize: '18px', color: '#1a1a1a' }}>
                {car.combined_mpg} MPG
              </div>
              <div style={{ color: '#666', fontSize: '11px' }}>
                City: {car.epa_city_mpg} / Hwy: {car.epa_highway_mpg}
              </div>
            </div>

            {/* Price */}
            <div style={{
              background: '#fdfdfd',
              minWidth: '170px',
              padding: '18px',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ color: '#000000', fontSize: '12px', fontWeight: '500' }}>Estimated Cost</div>
              <div style={{ fontWeight: '700', fontSize: '18px', color: '#1a1a1a' }}>
                ${car.estimated_current_cost.toLocaleString()}
              </div>
              <div style={{ color: '#666', fontSize: '11px' }}>
                Est. Value 2027: ${car.expected_value_2027.toLocaleString()}
              </div>
            </div>

            {/* Transmission */}
            <div style={{
              background: '#fdfdfd',
              minWidth: '170px',
              padding: '18px',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ color: '#666', fontSize: '12px', fontWeight: '500' }}>Drivetrain</div>
              <div style={{ fontWeight: '700', fontSize: '18px', color: '#1a1a1a' }}>
                {car.drive_type.toUpperCase()}
              </div>
              <div style={{ color: '#666', fontSize: '11px' }}>
                {car.transmission}
              </div>
            </div>

            {/* Dimensions */}
            <div style={{
              background: '#fdfdfd',
              minWidth: '170px',
              padding: '18px',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ color: '#666', fontSize: '12px', fontWeight: '500' }}>Capacity</div>
              <div style={{ fontWeight: '700', fontSize: '18px', color: '#1a1a1a' }}>
                {car.seats} Seats
              </div>
              <div style={{ color: '#666', fontSize: '11px' }}>
                {car.cargo_capacity} cu ft cargo
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specs */}
        <div style={{ marginTop: '48px' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#1a1a1a', fontSize: '25px', fontWeight: '800' }}>
            Complete Specifications
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {/* Performance */}
            <div style={{
              background: '#fdfdfd',
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#1a1a1a', fontSize: '16px', fontWeight: '600' }}>
                Performance
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Horsepower</span>
                  <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '500' }}>{car.horsepower_hp} HP</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Torque</span>
                  <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '500' }}>{car.torque_ft_lbs} lb-ft</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Engine Type</span>
                  <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '500' }}>{car.engine_type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Cam Type</span>
                  <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '500' }}>{car.cam_type}</span>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div style={{
              background: '#fdfdfd',
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#1a1a1a', fontSize: '16px', fontWeight: '600' }}>
                Dimensions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Length</span>
                  <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '500' }}>{car.length}"</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Width</span>
                  <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '500' }}>{car.width}"</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Height</span>
                  <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '500' }}>{car.height}"</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Curb Weight</span>
                  <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '500' }}>{car.curb_weight} lbs</span>
                </div>
              </div>
            </div>

            {/* Fuel */}
            <div style={{
              background: '#fdfdfd',
              padding: '24px',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#1a1a1a', fontSize: '16px', fontWeight: '600' }}>
                Fuel & Range
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Fuel Type</span>
                  <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '500' }}>{car.fuel_type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Tank Capacity</span>
                  <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '500' }}>{car.fuel_tank_capacity} gal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>City Range</span>
                  <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '500' }}>{car.range_city} mi</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>Highway Range</span>
                  <span style={{ color: '#1a1a1a', fontSize: '13px', fontWeight: '500' }}>{car.range_highway} mi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}