{
  productListVariant.map((row, rowIndex) => (
    <tr key={row[0].name}>
      <td className="fw-medium">
        {/* Kiểm tra nếu đã có ảnh, hiển thị ảnh đó, nếu không hiển thị Dropzone */}
        {row[0].image ? (
          <>
            <div
              style={{
                position: "relative",
                width: "100px",
                height: "150px",
              }}
            >
              <button
                type="button"
                className="btn btn-danger"
                onBlur={validation.handleBlur}
                onClick={() => handleRemoveImage(rowIndex, 0)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <i className="mdi mdi-archive-cancel"></i>
              </button>
              <img
                src={row[0].image.preview}
                alt="product"
                style={{ width: "100px", height: "150px" }}
              />
            </div>
          </>
        ) : (
          <CardBody>
            <div>
              <Dropzone
                onDrop={(acceptedFiles) => {
                  handleAcceptedFiles(acceptedFiles, rowIndex, 0);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="dropzone dz-clickable">
                    <div
                      className="dz-message needsclick mt-4"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <div className="mb-3">
                        <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                      </div>
                      <h5>Ảnh</h5>
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>
          </CardBody>
        )}
      </td>
      <td className="fw-medium">{row[0].name}</td>
      {!showVariationForm2 && (
        <>
          <td className="fw-medium">
            <Input
              type="text"
              placeholder="Giá tiền"
              onBlur={(e) => handlePriceChange(e, rowIndex, 0)}
            ></Input>
          </td>
          <td className="fw-medium">
            <Input
              type="text"
              placeholder="Số lượng"
              onBlur={(e) => handleStockChange(e, rowIndex, 0)}
            ></Input>
          </td>
        </>
      )}

      <style>
        {`    
              .main{
              
                flex-direction: column;
                border: 1px;
                border-left: 1px solid #ff7f5d;
                border-right: 1px  #ff7f5d;
              }
              .main .item-divider{
                border-bottom: 1px solid #ff7f5d;
                padding: 3px 0;
                margin-right: -10px; 
                margin-left: -10px;
                flex: 1;
                box-sizing: border-box;
              }
              .main .item-divider:last-child {
                border-bottom: none;
              }
              .classification-group {
                border-left: 1px  #ff7f5d;
                border-right: 1px  #ff7f5d;
                display: flex; /* Cho phép container là một flexbox */
                flex-direction: column;
                
              }
              .classification-group .item-divider {
                border-bottom: 1px solid #ff7f5d;
                padding: 9px 0;
                margin-right: -10px; 
                margin-left: -10px;
                flex: 1;
                box-sizing: border-box;
              }
              .classification-group .item-divider:last-child {
                border-bottom: none;
              }
            `}
      </style>

      {showVariationForm2 && (
        <>
          <td className="classification-group">
            {row.slice(1).map((column, coLumnIndex) => (
              <div key={column.name} className="item-divider">
                <div style={{ marginLeft: "20px" }}>{column.name}</div>
              </div>
            ))}
          </td>
          <td className="">
            {row.slice(1).map((column, coLumnIndex) => (
              <div key={column.name} className="item-divider">
                <div
                  style={{
                    marginLeft: "20px",
                    marginRight: "20px",
                    padding: "5px 0",
                  }}
                >
                  <Input
                    type="text"
                    placeholder="Giá tiền"
                    onBlur={(e) =>
                      handlePriceChange(e, rowIndex, coLumnIndex + 1)
                    }
                  ></Input>
                </div>
              </div>
            ))}
          </td>
          <td className="">
            {row.slice(1).map((column, coLumnIndex) => (
              <div key={column.name} className="item-divider">
                <div
                  style={{
                    marginLeft: "20px",
                    marginRight: "20px",
                    padding: "5px 0",
                  }}
                >
                  <Input
                    type="text"
                    placeholder="Số lượng"
                    onBlur={(e) =>
                      handleStockChange(e, rowIndex, coLumnIndex + 1)
                    }
                  ></Input>
                </div>
              </div>
            ))}
          </td>
        </>
      )}
    </tr>
  ));
}
