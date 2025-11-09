import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0b1220, #0f1724)' }}>
        <div className="text-white text-xl">Loading car details...</div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0b1220, #0f1724)' }}>
        <div className="text-red-500 text-xl">Error: {error || 'Car not found'}</div>
      </div>
    );
  }

  const imageUrl = car.img_path ? `http://127.0.0.1:5000/images/${car.img_path}` : '/placeholder-car.jpg';
  const avatarLetter = car.make.charAt(0).toUpperCase();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0b1220, #0f1724)',
      color: '#e6eef8',
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 28px',
        position: 'relative'
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
              background: 'linear-gradient(135deg, #bfbfbf, #6b7278)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0b1220',
              fontWeight: '700',
              fontSize: '28px',
              boxShadow: '0 8px 30px rgba(2,6,23,0.6)'
            }}>
              {avatarLetter}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', color: '#e6eef8' }}>
                {car.hack_id} {car.model}
              </h1>
              <p style={{ margin: 0, color: '#9aa4b2', fontSize: '13px' }}>
                Model {car.year}
              </p>
            </div>
          </div>

          <button 
            onClick={() => navigate(-1)}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              padding: '12px 24px',
              borderRadius: '24px',
              color: '#e6eef8',
              cursor: 'pointer',
              fontSize: '14px'
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
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e6eef8',
              boxShadow: 'inset 0 -6px 12px rgba(255,255,255,0.02), 0 8px 20px rgba(2,6,23,0.6)',
              fontSize: '20px'
            }}>≡</div>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e6eef8',
              boxShadow: 'inset 0 -6px 12px rgba(255,255,255,0.02), 0 8px 20px rgba(2,6,23,0.6)',
              fontSize: '20px'
            }}>□</div>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e6eef8',
              boxShadow: 'inset 0 -6px 12px rgba(255,255,255,0.02), 0 8px 20px rgba(2,6,23,0.6)',
              fontSize: '20px'
            }}>♡</div>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e6eef8',
              boxShadow: 'inset 0 -6px 12px rgba(255,255,255,0.02), 0 8px 20px rgba(2,6,23,0.6)',
              fontSize: '20px'
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
              background: 'rgba(255,255,255,0.01)',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <img 
                src={imageUrl}
                alt={`${car.make} ${car.model}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'contrast(1.03) saturate(0.9) drop-shadow(20px 24px 40px rgba(0,0,0,0.6))'
                }}
              />
            </div>
          </div>

          {/* Right Column */}
          <aside style={{ width: '220px', paddingTop: '40px' }}>
            <div style={{ textAlign: 'right', color: '#9aa4b2', fontSize: '13px' }}>
              Trim Level
            </div>
            <div style={{ textAlign: 'right', color: '#e6eef8', fontSize: '16px', marginTop: '8px' }}>
              {car.trim}
            </div>

            <div style={{ height: '24px' }}></div>

            <div style={{ color: '#9aa4b2', fontSize: '13px', textAlign: 'right' }}>
              {car.submodel} {car.year}
            </div>
          </aside>
        </div>

        {/* Feature Highlights */}
        <div style={{ marginTop: '36px' }}>
          <h3 style={{ margin: '0 0 14px 0', color: '#e6eef8', fontSize: '18px' }}>
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
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
              minWidth: '170px',
              padding: '18px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 12px 30px rgba(2,6,23,0.6)'
            }}>
              <div style={{ color: '#9aa4b2', fontSize: '12px' }}>Engine</div>
              <div style={{ fontWeight: '700', fontSize: '18px', color: '#e6eef8' }}>
                {car.size}L {car.cylinders}
              </div>
              <div style={{ color: '#9aa4b2', fontSize: '11px' }}>
                {car.horsepower_hp} HP @ {car.horsepower_rpm} RPM
              </div>
            </div>

            {/* MPG */}
            <div style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
              minWidth: '170px',
              padding: '18px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 12px 30px rgba(2,6,23,0.6)'
            }}>
              <div style={{ color: '#9aa4b2', fontSize: '12px' }}>Fuel Economy</div>
              <div style={{ fontWeight: '700', fontSize: '18px', color: '#e6eef8' }}>
                {car.combined_mpg} MPG
              </div>
              <div style={{ color: '#9aa4b2', fontSize: '11px' }}>
                City: {car.epa_city_mpg} / Hwy: {car.epa_highway_mpg}
              </div>
            </div>

            {/* Price */}
            <div style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
              minWidth: '170px',
              padding: '18px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 12px 30px rgba(2,6,23,0.6)'
            }}>
              <div style={{ color: '#9aa4b2', fontSize: '12px' }}>Estimated Cost</div>
              <div style={{ fontWeight: '700', fontSize: '18px', color: '#e6eef8' }}>
                ${car.estimated_current_cost.toLocaleString()}
              </div>
              <div style={{ color: '#9aa4b2', fontSize: '11px' }}>
                Est. Value 2027: ${car.expected_value_2027.toLocaleString()}
              </div>
            </div>

            {/* Transmission */}
            <div style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
              minWidth: '170px',
              padding: '18px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 12px 30px rgba(2,6,23,0.6)'
            }}>
              <div style={{ color: '#9aa4b2', fontSize: '12px' }}>Drivetrain</div>
              <div style={{ fontWeight: '700', fontSize: '18px', color: '#e6eef8' }}>
                {car.drive_type.toUpperCase()}
              </div>
              <div style={{ color: '#9aa4b2', fontSize: '11px' }}>
                {car.transmission}
              </div>
            </div>

            {/* Dimensions */}
            <div style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
              minWidth: '170px',
              padding: '18px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 12px 30px rgba(2,6,23,0.6)'
            }}>
              <div style={{ color: '#9aa4b2', fontSize: '12px' }}>Capacity</div>
              <div style={{ fontWeight: '700', fontSize: '18px', color: '#e6eef8' }}>
                {car.seats} Seats
              </div>
              <div style={{ color: '#9aa4b2', fontSize: '11px' }}>
                {car.cargo_capacity} cu ft cargo
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specs */}
        <div style={{ marginTop: '48px' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#e6eef8', fontSize: '18px' }}>
            Complete Specifications
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {/* Performance */}
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.03)'
            }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#e6eef8', fontSize: '16px' }}>
                Performance
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9aa4b2', fontSize: '13px' }}>Horsepower</span>
                  <span style={{ color: '#e6eef8', fontSize: '13px' }}>{car.horsepower_hp} HP</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9aa4b2', fontSize: '13px' }}>Torque</span>
                  <span style={{ color: '#e6eef8', fontSize: '13px' }}>{car.torque_ft_lbs} lb-ft</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9aa4b2', fontSize: '13px' }}>Engine Type</span>
                  <span style={{ color: '#e6eef8', fontSize: '13px' }}>{car.engine_type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9aa4b2', fontSize: '13px' }}>Cam Type</span>
                  <span style={{ color: '#e6eef8', fontSize: '13px' }}>{car.cam_type}</span>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.03)'
            }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#e6eef8', fontSize: '16px' }}>
                Dimensions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9aa4b2', fontSize: '13px' }}>Length</span>
                  <span style={{ color: '#e6eef8', fontSize: '13px' }}>{car.length}"</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9aa4b2', fontSize: '13px' }}>Width</span>
                  <span style={{ color: '#e6eef8', fontSize: '13px' }}>{car.width}"</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9aa4b2', fontSize: '13px' }}>Height</span>
                  <span style={{ color: '#e6eef8', fontSize: '13px' }}>{car.height}"</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9aa4b2', fontSize: '13px' }}>Curb Weight</span>
                  <span style={{ color: '#e6eef8', fontSize: '13px' }}>{car.curb_weight} lbs</span>
                </div>
              </div>
            </div>

            {/* Fuel */}
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.03)'
            }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#e6eef8', fontSize: '16px' }}>
                Fuel & Range
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9aa4b2', fontSize: '13px' }}>Fuel Type</span>
                  <span style={{ color: '#e6eef8', fontSize: '13px' }}>{car.fuel_type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9aa4b2', fontSize: '13px' }}>Tank Capacity</span>
                  <span style={{ color: '#e6eef8', fontSize: '13px' }}>{car.fuel_tank_capacity} gal</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9aa4b2', fontSize: '13px' }}>City Range</span>
                  <span style={{ color: '#e6eef8', fontSize: '13px' }}>{car.range_city} mi</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9aa4b2', fontSize: '13px' }}>Highway Range</span>
                  <span style={{ color: '#e6eef8', fontSize: '13px' }}>{car.range_highway} mi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}