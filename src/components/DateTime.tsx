const DateTime = ({
  value,
  sendValue,
}: {
  value: string;
  sendValue: (value: string) => void;
}) => {
  return (
    <div className="datetime">
      <label className={`datetime__label`} htmlFor="order_time">
        Order time
      </label>
      <input
        className={`datetime__input`}
        type="datetime-local"
        name="order_time"
        value={value}
        onChange={(e) => sendValue(e.target.value)}
        required
      />
    </div>
  );
};

export default DateTime;
