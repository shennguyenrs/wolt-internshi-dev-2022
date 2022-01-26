import { useState, useEffect, MouseEvent } from 'react';

// Components
import TextField from './components/TextField';
import DateTime from './components/DateTime';

// Styles
import './styles/all.css';

function App() {
  const [fee, setFee] = useState<number>(0);
  const [value, setValue] = useState<number | undefined>(undefined);
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [items, setItems] = useState<number | undefined>(undefined);
  const [orderDate, setOrderDate] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isDisabled, setIsDisable] = useState<boolean>(true);

  // Update submit button state on values change
  useEffect(() => {
    if (value !== undefined && distance !== undefined && items !== undefined) {
      if (orderDate !== '') {
        setIsDisable(false);
      }
    } else {
      setIsDisable(true);
    }
  }, [value, distance, items, orderDate]);

  // Calculate fee on submit form
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
      dateTime.getUTCDay() === 5 &&
      dateTime.getUTCHours() >= 15 &&
      dateTime.getHours() <= 19
    ) {
      setFee((deliveryFee + surcharge) * 1.1);
      setShowResult(true);
      return;
    }

    // Delivery never goes over 15
    if (deliveryFee + surcharge > 15) {
      setFee(15);
    } else {
      setFee(deliveryFee + surcharge);
    }

    setShowResult(true);
  };

  // Handle reset all states
  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="header__title">Delivery Fee Calculator</h1>
      </div>
      <div className="form-container">
        <div className="form">
          <div className="form__input-con">
            <TextField
              key="cart_value"
              label="cart_value"
              text="Cart Value (€)"
              sendValue={(value) => setValue(value)}
            />
            <TextField
              key="delivery_distance"
              label="delivery_distance"
              text="Delivery distance (m)"
              sendValue={(value) => setDistance(value)}
            />
            <TextField
              key="items_num"
              label="items_num"
              text="Amount of items"
              sendValue={(value) => setItems(value)}
            />
            <DateTime
              value={orderDate}
              sendValue={(value) => setOrderDate(value)}
            />
          </div>
          <button
            className="form__btn"
            onClick={handleCalculateFee}
            disabled={isDisabled}
          >
            Calculate fee
          </button>
        </div>
        <div className="result">
          <p className={`result__p${showResult ? '--show' : ''}`}>
            Your delivery fee
          </p>
          <br />
          <p className={`result__p2${showResult ? '--show' : ''}`}>€{fee}</p>
          {showResult && (
            <button className="result__btn" onClick={handleReset}>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
