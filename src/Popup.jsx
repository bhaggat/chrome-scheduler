import React from 'react';

function Popup() {
  return (
    <div>
      <h1>Hello from Chrome Extension!</h1>
      <button onClick={() => alert('Button clicked!')}>Click me</button>
    </div>
  );
}

export default Popup;
