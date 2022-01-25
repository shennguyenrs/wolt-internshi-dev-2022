import { useState, MouseEvent } from 'react';

// Styles
import './styles/App.css';

function App() {
  const [fee, setFee] = useState<number>(0);
  const [value, setValue] = useState<string>();
  const [distance, setDistance] = useState<string>();
  const [items, setItems] = useState<string>();
  const [orderDate, setOrderDate] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  const handleCalculateFee = (e: MouseEvent) => {
    e.preventDefault();

    let surcharge = 0;
    let deliveryFee = 0;
    const cartValue = Number(value);
    const distanceValue = Number(distance);
    const itemsNum = Number(items);
    const dateTime = new Date(orderDate);

    // Return delivery fee is 0 if cart value is equal or more than 100
    if (cartValue >= 100) {
      setFee(0);
      setShowResult(true);
      return;
    }

    // If cart value if smaller than 10
    // there is surcharge equal 10 - cart value
    if (cartValue < 10) {
      surcharge += 10 - cartValue;
    }

    // Delivery fee is base 2 for first 1000m
    // added 1 for each 500m
    let tempDistance = distanceValue;
    tempDistance -= 1000;
    deliveryFee += 2;

    while (tempDistance > 0) {
      deliveryFee += 1;
      tempDistance -= 500;
    }

    // Add 0.5 for each items above 4
    if (itemsNum > 4) {
      surcharge += (itemsNum - 4) * 0.5;
    }

    // If order date on Friday rush hour, increase delivery fee and surcharge by multiplied 1.1
    // Friday is 5 in UTC
    // From 3 to 7 PM is from 15 to 19 in UTC
    if (
      dateTime.getUTCDay() == 5 &&
      dateTime.getUTCHours() >= 15 &&
      dateTime.getHours() <= 19
    ) {
      setFee((deliveryFee + surcharge) * 1.1);
      setShowResult(true);
      return;
    }

    setFee(deliveryFee + surcharge);
    setShowResult(true);
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="header__title">Delivery Fee Calculator</h1>
      </div>
      <div className="form-container">
        <div className="form">
          <label htmlFor="cart_value">Cart Value (€)</label>
          <input
            type="text"
            name="cart_value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
          <label htmlFor="delivery_distance">Delivery distance (m)</label>
          <input
            type="text"
            name="delivery_distance"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
          />
          <label htmlFor="item_num">Number of items</label>
          <input
            type="number"
            name="item_num"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            required
          />
          <label htmlFor="order_time">Order time</label>
          <input
            type="datetime-local"
            name="order_time"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            required
          />
          <div className="form__btn">
            <button onClick={handleCalculateFee}>Calculate fee</button>
          </div>
        </div>
        <div className="result">
          <p className={`result__p${showResult ? '--show' : ''}`}>
            Your delivery fee: €{fee}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
