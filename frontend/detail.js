// Simple static detail renderer for detail.html
(function(){
  function qs(name){
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  const model = qs('model') || 'Camry';

  // Minimal dataset (subset of app data) — keys keyed by model name
  const data = {
    'Model 3': {
      title: 'Tesla Model 3', sub: '2024', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&q=80',
      colors: ['#000','#2b2b2b','#5a2b5a','#d6336c'],
      features: [
        {small: 'Passenger', big: '5', img: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&q=60'},
        {small: 'Engine', big: 'Electric Motor'},
        {small: 'Vehicle', big: 'Electric Vehicle'},
        {small: 'Acceleration', big: '3.1 sec'}
      ]
    },
    'Camry': {
      title: 'Toyota Camry', sub: 'Model 2024', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80',
      colors: ['#000','#3b3b3b','#4b7a50','#c0392b'],
      features: [
        {small: 'Passenger', big: '5', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=60'},
        {small: 'Engine', big: '2.5L 4-Cylinder'},
        {small: 'Vehicle', big: 'Gasoline'},
        {small: 'Acceleration', big: '6.8 sec'}
      ]
    },
    'Rav-4': {
      title: 'Toyota Rav-4', sub: 'Model 2015', image: 'https://images.unsplash.com/photo-1549921296-3a69d3f2a2a9?w=1200&q=80',
      colors: ['#111','#2f2f2f','#4b6','#c0392b'],
      features: [
        {small:'Passenger', big:'5', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=60'},
        {small:'Engine', big:'2.0L 4-cylinder'},
        {small:'Vehicle', big:'Crossover'},
        {small:'Acceleration', big:'7.2 sec'}
      ]
    }
  };

  // fallback to Camry if not found
  const car = data[model] || data['Camry'];

  // populate
  document.getElementById('car-title').textContent = car.title;
  document.getElementById('car-sub').textContent = car.sub;
  const img = document.getElementById('car-image');
  img.src = car.image;
  img.alt = car.title;

  const dots = document.getElementById('color-dots');
  car.colors.forEach(c=>{
    const d = document.createElement('span');
    d.className = 'color-dot';
    d.style.background = c;
    dots.appendChild(d);
  });

  const pills = document.getElementById('feature-pills');
  car.features.forEach(f=>{
    const p = document.createElement('div');
    p.className='pill';
    if(f.img){
      p.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div><div class=\"small\">${f.small}</div><div class=\"big\">${f.big}</div></div><img src=\"${f.img}\" alt=\"${f.small}\"/></div>`;
    } else {
      p.innerHTML = `<div class=\"small\">${f.small}</div><div class=\"big\">${f.big}</div>`;
    }
    pills.appendChild(p);
  });

})();
