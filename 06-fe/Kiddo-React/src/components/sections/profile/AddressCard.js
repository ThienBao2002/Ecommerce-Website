import React from 'react';
import { Card, CardBody, Badge, Button } from 'reactstrap'; // Assuming you're using Reactstrap
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const AddressCard = ({ item, handleUpdateAddress, handleDeleteAddress }) => {
  return (
    <Card className="profile-project-card shadow-none">
          <CardBody className="p-4">
              <div className="d-flex">
                  <div className="flex-grow-1 text-muted overflow-hidden">
                      {item.isDefault ? (
                          <Badge className="badge-gradient-primary">Địa chỉ mặc định</Badge>
                      ) : <span>#</span>}
                      <h5 className="fs-14 text-truncate">
                          <Link to="#" className="text-body">
                              {item.name}
                          </Link>
                      </h5>
                      <p className="text-muted text-truncate mb-0">
              Số điện thoại: <span className="fw-semibold text-body">{item.phoneNumber}</span>
            </p>
            <p className="text-muted text-truncate mb-0">
              Email: <span className="fw-semibold text-body">{item.email}</span>
            </p>
          </div>
        </div>

        <div className="d-flex mt-4">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2">
              <div>
                <h5 className="fs-12 text-muted mb-0">Địa chỉ: {item.shippingAddress}</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex" style={{ marginTop: "10px" }}>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2">
              <Button onClick={() => handleUpdateAddress(item)} color="light">
                <i className="ri-brush-2-fill" />Sửa
              </Button>
              <Button onClick={() => handleDeleteAddress(item)} color="danger">
                <i className="ri-delete-bin-5-line" />Xóa
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AddressCard;
