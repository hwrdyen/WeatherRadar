import "./ToggleSwitch.scss";

interface ToggleSwitchProps {
  isUpdating: boolean; // Change to match your prop name
  toggleUpdate: () => void; // Function to toggle the state
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isUpdating,
  toggleUpdate,
}) => {
  return (
    <div className="toggle-switch__container">
      <label className="toggle-switch__label">
        <input
          type="checkbox"
          className="toggle-switch__input"
          checked={isUpdating}
          onChange={toggleUpdate}
        />
        <span className="toggle-switch__slider"></span>
      </label>
      <span
        className={`toggle-switch__status toggle-switch--${
          isUpdating ? "play" : "pause"
        }`}
      >
        {isUpdating ? "Play" : "Paused"}
      </span>
    </div>
  );
};

export default ToggleSwitch;
