import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Modal,
    Form,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Label,
    Input,
    FormFeedback,
    FormGroup,
} from "reactstrap";

import { Link } from "react-router-dom";
import { isEmpty } from "lodash";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

// Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

import {
    getRanks as onGetRanks,
    addNewRank as onAddNewRank,
    updateRank as onUpdateRank,
    deleteRank as onDeleteRank,
} from "../../../slices/thunks";

// Redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../Components/Common/Loader";
import ImageArrayComponent from "../EcommerceProducts/ImageArrayComponent";

const EcommerceRanks = () => {
    const dispatch = useDispatch();

    // Use selector to get ranks data
    const { ranks, isRankSuccess, error } = useSelector(state => ({
        ranks: state.Ecommerce.ranks,
        isRankSuccess: state.Ecommerce.isRankSuccess,
        error: state.Ecommerce.error,
    }));

    const [selectedFilesImageRank, setSelectedFilesImageRank] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [rank, setRank] = useState([]);
    const [isExportCSV, setIsExportCSV] = useState(false);

    // Delete rank
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalMulti, setDeleteModalMulti] = useState(false);
    const [rankToDelete, setRankToDelete] = useState(null); // State to hold the rank to be deleted

    const [modal, setModal] = useState(false);

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
            setRank(null);
        } else {
            setModal(true);
        }
    }, [modal]);

    // Delete Data
    const onClickDelete = (rank) => {
        setRankToDelete(rank); // Set the rank to be deleted
        setDeleteModal(true); // Show the delete modal
    };

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            rankName: (rank && rank.rankName) || "",
            minPoints: (rank && rank.minPoints) ?? 0,
            maxPoints: (rank && rank.maxPoints) || "",
            description: (rank && rank.description) || "",
            imageRank: (rank && rank.imageRank) || "",
            
        },
        validationSchema: Yup.object({
            rankName: Yup.string()
                .required("Vui lòng nhập tên hạng"),
            minPoints: Yup.number()
                .required("Vui lòng nhập điểm tối thiểu")
                .min(0, "Điểm tối thiểu phải là 0 hoặc lớn hơn"),
            maxPoints: Yup.number()
                .required("Vui lòng nhập điểm tối đa")
                .positive("Điểm tối đa phải lớn hơn 0"),
            imageRank: Yup.array()
                .test(
                    "images-validation",
                    "Vui lòng thêm ít nhất một hình ảnh",
                    function (value) {
                        return value && value.length >= 1;
                    }
                ),
        }),
        onSubmit: async (values) => {
            const rankData = new FormData();
            rankData.append("rankName", values.rankName);
            rankData.append("minPoints", values.minPoints);
            rankData.append("maxPoints", values.maxPoints);
            rankData.append("description", values.description);
            const fileNamesImageRank = values.imageRank.map(file => file.name).join(', ');
            rankData.append("nameImageRank", fileNamesImageRank);
            values.imageRank.forEach((file) => {
                if (file instanceof File) rankData.append("imageRank", file);
            });

            try {
                if (isEdit) {
                    rankData.append("id", rank._id);
                    const actionResult = await dispatch(onUpdateRank(rankData));
                    
                    if (onUpdateRank.fulfilled.match(actionResult)) {
                        await dispatch(onGetRanks()); // Tải lại danh sách hạng
                        validation.resetForm();
                        toggle();
                    } else {
                        toast.error("Cập nhật hạng thất bại");
                    }
                } else {
                    const actionResult = await dispatch(onAddNewRank(rankData));
                    if (onAddNewRank.fulfilled.match(actionResult)) {
                        await dispatch(onGetRanks()); // Tải lại danh sách hạng
                        validation.resetForm();
                        toggle();
                    } else {
                        toast.error("Thêm hạng thất bại");
                    }
                }
            } catch (error) {
                toast.error("Đã xảy ra lỗi: " + error.message);
            }
        },
    });

    // Delete Data
    const handleDeleteRank = async () => {
        if (rankToDelete) {
            console.log(rankToDelete);
            try {
                const actionResult = await dispatch(onDeleteRank(rankToDelete));
                if (onDeleteRank.fulfilled.match(actionResult)) {
                    await dispatch(onGetRanks());
                    setDeleteModal(false);
                    setRankToDelete(null);
                } else {
                    toast.error("Xóa hạng thất bại");
                    setDeleteModal(false);
                }
            } catch (error) {
                toast.error("Đã xảy ra lỗi: " + error.message);
                setDeleteModal(false);
            }
        }
    };

    // Update Data
    const handleEditRankClick = useCallback(
        (arg) => {
            const rank = arg;
            setSelectedFilesImageRank(rank.imageRank);
            setRank({
                _id: rank._id,
                rankName: rank.rankName,
                minPoints: rank.minPoints,
                maxPoints: rank.maxPoints,
                description: rank.description,
                imageRank: rank.imageRank,
            });

            setIsEdit(true);
            toggle();
        },
        [toggle]
    );

    const handleAddRankClick = useCallback(() => {
        setRank({
            _id: null,
            rankName: "",
            minPoints: "",
            maxPoints: "",
            description: "",
            imageRank: "",
        });

        setIsEdit(false);
        toggle();
    }, [toggle]);

    useEffect(() => {
        if (!ranks || ranks.length === 0) {
            dispatch(onGetRanks());
        }
    }, [dispatch, ranks]);

    useEffect(() => {
        setRank(ranks);
    }, [ranks]);

    useEffect(() => {
        if (!isEmpty(ranks)) {
            setRank(ranks);
            setIsEdit(false);
        }
    }, [ranks]);

    const handleRankClicks = () => {
        setRank("");
        setIsEdit(false);
        toggle();
    };

    // Checked All
    const checkedAll = useCallback(() => {
        const checkall = document.getElementById("checkBoxAll");
        const ele = document.querySelectorAll(".rankCheckBox");

        if (checkall.checked) {
            ele.forEach((ele) => {
                ele.checked = true;
            });
        } else {
            ele.forEach((ele) => {
                ele.checked = false;
            });
        }
        deleteCheckbox();
    }, []);

    // Delete Multiple
    const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
    const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

    const deleteMultiple = () => {
        const checkall = document.getElementById("checkBoxAll");
        selectedCheckBoxDelete.forEach((element) => {
            dispatch(onDeleteRank(element.value));
            setTimeout(() => {
                toast.clearWaitingQueue();
            }, 3000);
        });
        setIsMultiDeleteButton(false);
        checkall.checked = false;
    };

    const deleteCheckbox = () => {
        const ele = document.querySelectorAll(".rankCheckBox:checked");
        ele.length > 0
            ? setIsMultiDeleteButton(true)
            : setIsMultiDeleteButton(false);
        setSelectedCheckBoxDelete(ele);
    };
    
    // Ranks Column
    const columns = useMemo(
        () => [
            {
                Header: "",
                accessor: "_id",
                hiddenColumns: true,
                Cell: (cell) => {
                    return <input type="hidden" value={cell.value} />;
                },
            },
            {
                Header: "Tên hạng",
                accessor: "rankName",
                filterable: true,
            },
            {
                Header: "Điểm tối thiểu",
                accessor: "minPoints",
                filterable: true,
            },
            {
                Header: "Điểm tối đa",
                accessor: "maxPoints",
                filterable: true,
            },
            {
                Header: "Mô tả",
                accessor: "description",
                filterable: true,
            },
            {
                Header: "Hình ảnh",
                accessor: "imageRank",
                filterable: true,
                Cell: (cellProps) => {
                    return (
                        <>
                            <img
                                src={cellProps?.row?.original?.imageRank[0]?.url}
                                alt={cellProps.row.original.rankName}
                                width="50"
                                height="50"
                            />
                        </>
                    );
                },
            },
            {
                Header: "Thao tác",
                Cell: (cellProps) => {
                    return (
                        <ul className="list-inline hstack gap-2 mb-0">
                            <li className="list-inline-item edit" title="Edit">
                                <Link
                                    to="#"
                                    className="text-primary d-inline-block edit-item-btn"
                                    onClick={() => {
                                        const rankData = cellProps.row.original;
                                        handleEditRankClick(rankData);
                                    }}
                                >
                                    <i className="ri-pencil-fill fs-16"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item delete" title="Delete">
                                <Link
                                    to="#"
                                    className="text-danger d-inline-block delete-item-btn"
                                    onClick={() => {
                                        const rankData = cellProps.row.original;
                                        onClickDelete(rankData);
                                    }}
                                >
                                    <i className="ri-delete-bin-5-fill fs-16"></i>
                                </Link>
                            </li>
                        </ul>
                    );
                },
            },
            
        ],
        [handleEditRankClick, checkedAll]
    );

    return (
        <React.Fragment>
            <ToastContainer closeButton={false} limit={1} />
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteRank}
                onCloseClick={() => setDeleteModal(false)}
            />
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={ranks}
                />
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteRank}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <DeleteModal
                    show={deleteModalMulti}
                    onDeleteClick={() => {
                        deleteMultiple();
                        setDeleteModalMulti(false);
                    }}
                    onCloseClick={() => setDeleteModalMulti(false)}
                />
                <Container fluid>
                    <BreadCrumb title="Hạng khách hàng" pageTitle="Thương mại điện tử" />
                    <Row>
                        <Col lg={12}>
                            <Card id="rankList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Danh sách hạng</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                {isMultiDeleteButton && (
                                                    <button
                                                        className="btn btn-soft-danger me-1"
                                                        onClick={() => setDeleteModalMulti(true)}
                                                    >
                                                        <i className="ri-delete-bin-2-line"></i>
                                                    </button>
                                                )}
                                                {/* <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setIsExportCSV(true)}
                                                >
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Xuất excel
                                                </button> */}
                                                <button
                                                    type="button"
                                                    className="btn btn-soft-secondary"
                                                    onClick={() => handleAddRankClick()}
                                                    style={{ margin: '10px' }} // Thêm margin
                                                >
                                                    <i className="ri-add-circle-line align-middle me-1"></i>{" "}
                                                    Thêm
                                                </button>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>
                                        {isRankSuccess && ranks.length ? (
                                            <TableContainer
                                                columns={columns}
                                                data={ranks || []}
                                                isGlobalFilter={true}
                                                isAddUserList={false}
                                                customPageSize={10}
                                                className="custom-header-css"
                                                handleRankClick={handleRankClicks}
                                                isRankFilter={true}
                                                SearchPlaceholder="Tìm kiếm tên hạng, điểm tối thiểu, điểm tối đa, mô tả..."
                                            />
                                        ) : (
                                            <Loader error={error} />
                                        )}
                                    </div>
                                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                                            {isEdit ? "Chỉnh sửa hạng" : "Thêm hạng"}
                                        </ModalHeader>
                                        <Form
                                            className="tablelist-form"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                validation.handleSubmit();
                                                return false;
                                            }}
                                        >
                                            <ModalBody>
                                                <FormGroup>
                                                    <Label for="rankName-field">Tên hạng</Label>
                                                    <Input
                                                        id="rankName-field"
                                                        name="rankName"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.rankName || ""}
                                                        invalid={validation.touched.rankName && !!validation.errors.rankName}
                                                    />
                                                    <FormFeedback>
                                                        {validation.errors.rankName}
                                                    </FormFeedback>
                                                </FormGroup>

                                                <FormGroup>
                                                    <Label for="minPoints-field">Điểm tối thiểu</Label>
                                                    <Input
                                                        id="minPoints-field"
                                                        name="minPoints"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.minPoints || ""}
                                                        invalid={validation.touched.minPoints && !!validation.errors.minPoints}
                                                    />
                                                    <FormFeedback>
                                                        {validation.errors.minPoints}
                                                    </FormFeedback>
                                                </FormGroup>

                                                <FormGroup>
                                                    <Label for="maxPoints-field">Điểm tối đa</Label>
                                                    <Input
                                                        id="maxPoints-field"
                                                        name="maxPoints"
                                                        type="number"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.maxPoints || ""}
                                                        invalid={validation.touched.maxPoints && !!validation.errors.maxPoints}
                                                    />
                                                    <FormFeedback>
                                                        {validation.errors.maxPoints}
                                                    </FormFeedback>
                                                </FormGroup>

                                                <FormGroup>
                                                    <Label for="description-field">Mô tả</Label>
                                                    <Input
                                                        id="description-field"
                                                        name="description"
                                                        type="textarea"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.description || ""}
                                                        invalid={validation.touched.description && !!validation.errors.description}
                                                    />
                                                    <FormFeedback>
                                                        {validation.errors.description}
                                                    </FormFeedback>
                                                </FormGroup>

                                                <FormGroup>
                                                    <Label>Hình ảnh</Label>
                                                    <ImageArrayComponent
                                                        nameComponent="Hạng"
                                                        nameField="imageRank"
                                                        selectedFiles={selectedFilesImageRank}
                                                        setSelectedFiles={setSelectedFilesImageRank}
                                                        validation={validation}
                                                    />
                                                </FormGroup>
                                            </ModalBody>
                                            <ModalFooter>
                                                <div className="hstack gap-2 justify-content-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-light"
                                                        onClick={() => {
                                                            setModal(false);
                                                        }}
                                                    >
                                                        Đóng
                                                    </button>
                                                    <button type="submit" className="btn btn-success">
                                                        {isEdit ? "Chỉnh sửa" : "Thêm hạng"}
                                                    </button>
                                                </div>
                                            </ModalFooter>
                                        </Form>
                                    </Modal>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EcommerceRanks;
