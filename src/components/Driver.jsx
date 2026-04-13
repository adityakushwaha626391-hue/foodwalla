import io from 'socket.io-client';

function Driver() {
  const socket = io('http://192.168.1.XXX:5001');
  
  const moveDriver = () => {

socket.emit('driver-location', {
  lat: newLat,
  lng: newLng,
  orderId: 'FW123456'
});

  };
  
  return (
    <div style={{padding: 40, textAlign: 'center'}}>
      <h1 style={{fontSize: 48}}>🚚 DRIVER PANEL</h1>
      <button onClick={moveDriver} style={{
        padding: '20px 60px', background: '#ef4444', color: 'white',
        border: 'none', borderRadius: 20, fontSize: 24, cursor: 'pointer'
      }}>
         LIVE UPDATE LOCATION!
      </button>
    </div>
  );
}
