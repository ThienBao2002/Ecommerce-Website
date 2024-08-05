const Name = (cell) => {
  return cell.value ? cell.value : "";
};

const CreatedBy = (cell) => {
  return cell.value ? cell.value : "";
};

const APIKeys = (cell) => {
  return (
    <span type="input" className="form-control apikey-value">{cell.value}</span>
  );
};

const Status = (cell) => {
  return cell.value ? <span className={cell.value === "Disable" ? "badge bg-danger-subtle text-danger" : "badge bg-success-subtle text-success"}>{cell.value}</span> : "";
};

const CreatedDate = (cell) => {
  return cell.value ? cell.value : "";
};

const ExpiryDate = (cell) => {
  return cell.value ? cell.value : "";
};

export { Name, CreatedBy, APIKeys, Status, CreatedDate, ExpiryDate };
