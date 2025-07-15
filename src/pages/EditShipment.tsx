import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  fetchShipmentById,
  updateShipment,
  resetUpdateSuccess,
} from "../redux/slices/editShipmentSlice";
import { fetchCommodities } from "../redux/slices/commoditySlice";
import { RootState, AppDispatch } from "../redux/store";
import { toast } from "react-toastify";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import StepOneFormFields from "../components/pagecomponents/addshipmentpage/StepOneFormFields";
import StepTwoFormFields from "../components/pagecomponents/addshipmentpage/StepTwoFormFields";
import StepThreeFormFields from "../components/pagecomponents/addshipmentpage/StepThreeFormFields";
import StepFourFormFields from "../components/pagecomponents/addshipmentpage/StepFourFormFields";
import FormNavigation from "../components/pagecomponents/addshipmentpage/FormNavigation";
import { SidebarContext } from "../contexts/SidebarContext";
import "../styles/global/AddShipment.scss";

// Shipment type
interface Shipment {
  shipment_id: string;
  cust_id?: string;
  product_id?: string;
  include_invoice_tax?: string;
  category_id?: string;
  net_weight?: string;
  gross_weight?: string;
  payment_mode?: string;
  sub_payment_mode?: string;
  service_id?: string;
  invoice_value?: string;
  axlpl_insurance?: string;
  shipment_status?: string;
  policy_no?: string;
  exp_date?: string;
  insurance_value?: string;
  remark?: string;
  bill_to?: string;
  number_of_parcel?: string;
  additional_axlpl_insurance?: string;
  calculation_status?: string;
  created_date?: string;
  modified_date?: string;
  invoice_number?: string;
  shipment_invoice_no?: string;
  is_amt_edited_by_user?: string;
  cash_amount?: string;
  is_new_sender_address?: string;
  sender_customer_id?: string;
  sender_name?: string;
  sender_company_name?: string;
  sender_country?: string;
  sender_state?: string;
  sender_city?: string;
  sender_area?: string;
  sender_pincode?: string;
  sender_address1?: string;
  sender_address2?: string;
  sender_mobile?: string;
  sender_email?: string;
  sender_saveaddress?: string;
  sender_gst_no?: string;
  is_new_receiver_address?: string;
  receiver_customer_id?: string;
  receiver_name?: string;
  receiver_company_name?: string;
  receiver_country?: string;
  receiver_state?: string;
  receiver_city?: string;
  receiver_area?: string;
  receiver_pincode?: string;
  receiver_address1?: string;
  receiver_address2?: string;
  receiver_mobile?: string;
  receiver_email?: string;
  receiver_saveaddress?: string;
  receiver_gst_no?: string;
  diffadd_country?: string;
  diffadd_state?: string;
  diffadd_city?: string;
  diffadd_area?: string;
  diffadd_pincode?: string;
  diffadd_address1?: string;
  diffadd_address2?: string;
  cash_collected_by?: string;
  shipment_charges?: string;
  insurance_charges?: string;
  invoice_charges?: string;
  handling_charges?: string;
  tax?: string;
  total_charges?: string;
  grand_total?: string;
}

const steps = [
  {
    title: "Shipment Details",
    subtitle: "Basic shipment information",
    icon: "📦",
  },
  {
    title: "Address Information",
    subtitle: "Pickup and delivery addresses",
    icon: "📍",
  },
  {
    title: "Delivery Options",
    subtitle: "Different delivery address",
    icon: "🚚",
  },
  {
    title: "Review & Confirm",
    subtitle: "Review and submit your shipment",
    icon: "✅",
  },
];

const validationSchemas = [
  // Step 1: Shipment Details
  Yup.object({
    name: Yup.string().required("Name is required"),
    category: Yup.object().nullable().required("Please select category"),
    commodity: Yup.array().min(1, "Please select at least one commodity"),
    netWeight: Yup.number()
      .positive("Net weight must be positive")
      .required("Net weight is required"),
    grossWeight: Yup.number()
      .positive("Gross weight must be positive")
      .required("Gross weight is required"),
    paymentMode: Yup.object().nullable().required("Please select payment mode"),
    numberOfParcel: Yup.number()
      .positive("Number of parcels must be positive")
      .required("Number of parcels is required"),
    serviceType: Yup.object().nullable().required("Please select service type"),
    invoiceValue: Yup.number()
      .positive("Invoice value must be positive")
      .required("Invoice value is required"),
    invoiceNumber: Yup.string().required("Invoice number is required"),
  }),
  // Step 2: Address Information
  Yup.object({
    senderAddressType: Yup.string().oneOf(["new", "existing"]).required(),
    receiverAddressType: Yup.string().oneOf(["new", "existing"]).required(),
    billTo: Yup.string().oneOf(["sender", "receiver"]).required(),
    senderName: Yup.string().min(2).max(100).required(),
    senderCompanyName: Yup.string().min(2).max(100).required(),
    senderZipCode: Yup.string()
      .matches(/^[0-9]{6}$/)
      .required(),
    senderState: Yup.mixed().test(
      "senderState",
      "Sender state is required",
      function (value) {
        if (!value) return false;
        // Accept both {label: string} and string
        const stateValue =
          typeof value === "object" && value !== null && "label" in value
            ? (value as any).label
            : value;
        if (!stateValue || typeof stateValue !== "string") return false;
        const trimmed = stateValue.trim();
        return (
          trimmed.length >= 2 &&
          trimmed.length <= 50 &&
          /^[a-zA-Z\s.-]+$/.test(trimmed)
        );
      }
    ),
    senderCity: Yup.mixed().test(
      "senderCity",
      "Sender city is required",
      function (value) {
        if (!value) return false;
        const cityValue =
          typeof value === "object" && value !== null && "label" in value
            ? (value as any).label
            : value;
        if (!cityValue || typeof cityValue !== "string") return false;
        const trimmed = cityValue.trim();
        return (
          trimmed.length >= 2 &&
          trimmed.length <= 50 &&
          /^[a-zA-Z\s.-]+$/.test(trimmed)
        );
      }
    ),
    senderArea: Yup.object().nullable(),
    senderGstNo: Yup.string()
      .matches(/^[a-zA-Z0-9]{15}$/)
      .required(),
    senderAddressLine1: Yup.string().min(5).max(200).required(),
    senderAddressLine2: Yup.string().min(5).max(200).required(),
    senderMobile: Yup.string()
      .matches(/^[0-9]{10}$/)
      .required(),
    senderEmail: Yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .required(),
    receiverName: Yup.string().min(2).max(100).required(),
    receiverCompanyName: Yup.string().min(2).max(100).required(),
    receiverZipCode: Yup.string()
      .matches(/^[0-9]{6}$/)
      .required(),
    receiverState: Yup.mixed().test(
      "receiverState",
      "Receiver state is required",
      function (value) {
        if (!value) return false;
        const stateValue =
          typeof value === "object" && value !== null && "label" in value
            ? (value as any).label
            : value;
        if (!stateValue || typeof stateValue !== "string") return false;
        const trimmed = stateValue.trim();
        return (
          trimmed.length >= 2 &&
          trimmed.length <= 50 &&
          /^[a-zA-Z\s.-]+$/.test(trimmed)
        );
      }
    ),
    receiverCity: Yup.mixed().test(
      "receiverCity",
      "Receiver city is required",
      function (value) {
        if (!value) return false;
        const cityValue =
          typeof value === "object" && value !== null && "label" in value
            ? (value as any).label
            : value;
        if (!cityValue || typeof cityValue !== "string") return false;
        const trimmed = cityValue.trim();
        return (
          trimmed.length >= 2 &&
          trimmed.length <= 50 &&
          /^[a-zA-Z\s.-]+$/.test(trimmed)
        );
      }
    ),
    receiverArea: Yup.object().nullable(),
    receiverGstNo: Yup.string()
      .matches(/^[a-zA-Z0-9]{15}$/)
      .required(),
    receiverAddressLine1: Yup.string().min(5).max(200).required(),
    receiverAddressLine2: Yup.string().min(5).max(200).required(),
    receiverMobile: Yup.string()
      .matches(/^[0-9]{10}$/)
      .required(),
    receiverEmail: Yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .required(),
    senderCustomerId: Yup.string().nullable(),
    receiverCustomerId: Yup.string().nullable(),
  }),
  // Step 3: Delivery Address
  Yup.object({
    isDifferentDeliveryAddress: Yup.boolean(),
    deliveryZipCode: Yup.string().when("isDifferentDeliveryAddress", {
      is: true,
      then: (schema) =>
        schema
          .trim()
          .matches(/^[0-9]{6}$/)
          .required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    deliveryState: Yup.string().when("isDifferentDeliveryAddress", {
      is: true,
      then: (schema) =>
        schema
          .trim()
          .min(2)
          .max(50)
          .matches(/^[a-zA-Z\s.-]+$/)
          .required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    deliveryCity: Yup.string().when("isDifferentDeliveryAddress", {
      is: true,
      then: (schema) =>
        schema
          .trim()
          .min(2)
          .max(100)
          .matches(/^[a-zA-Z\s.-]+$/)
          .required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    deliveryAddressLine1: Yup.string().when("isDifferentDeliveryAddress", {
      is: true,
      then: (schema) => schema.trim().min(5).max(200).required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    deliveryAddressLine2: Yup.string().when("isDifferentDeliveryAddress", {
      is: true,
      then: (schema) => schema.trim().max(200).nullable(),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  // Step 4: Review & Confirmation
  Yup.object({}),
];

const validateStep2CriticalFields = (values: any) => {
  const errors: string[] = [];
  if (
    !values.senderGstNo ||
    values.senderGstNo.length !== 15 ||
    !/^[a-zA-Z0-9]{15}$/.test(values.senderGstNo)
  ) {
    errors.push("Sender GST Number must be exactly 15 alphanumeric characters");
  }
  if (
    !values.senderMobile ||
    values.senderMobile.length !== 10 ||
    !/^\d{10}$/.test(values.senderMobile)
  ) {
    errors.push("Sender Mobile Number must be exactly 10 digits");
  }
  if (
    !values.senderEmail ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.senderEmail)
  ) {
    errors.push("Sender Email must be in valid format");
  }
  if (
    !values.receiverGstNo ||
    values.receiverGstNo.length !== 15 ||
    !/^[a-zA-Z0-9]{15}$/.test(values.receiverGstNo)
  ) {
    errors.push(
      "Receiver GST Number must be exactly 15 alphanumeric characters"
    );
  }
  if (
    !values.receiverMobile ||
    values.receiverMobile.length !== 10 ||
    !/^\d{10}$/.test(values.receiverMobile)
  ) {
    errors.push("Receiver Mobile Number must be exactly 10 digits");
  }
  if (
    !values.receiverEmail ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      values.receiverEmail
    )
  ) {
    errors.push("Receiver Email must be in valid format");
  }
  return errors;
};

const EditShipment: React.FC = () => {
  const { shipment_id } = useParams<{ shipment_id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { shipment, loading, error, updateSuccess } = useSelector(
    (state: RootState) =>
      state.editShipment as {
        shipment: Shipment | null;
        loading: boolean;
        error: string | null;
        updateSuccess: boolean;
      }
  );
  const { categories } = useSelector((state: RootState) => state.category);
  const { paymentModes } = useSelector((state: RootState) => state.paymentMode);
  const { serviceTypes } = useSelector((state: RootState) => state.serviceType);
  const { commodities } = useSelector(
    (state: RootState) => state.commodity || { commodities: [] }
  ); // Add this if not present

  // Build options arrays for selects
  const categoryOptions = categories.map((category: any) => ({
    value: category.id,
    label: category.name,
  }));
  const paymentModeOptions = paymentModes.map((mode: any) => ({
    value: mode.id,
    label: mode.name,
  }));
  const serviceTypeOptions = serviceTypes.map((type: any) => ({
    value: type.id,
    label: type.name,
  }));
  const commodityOptions = commodities.map((commodity: any) => ({
    value: commodity.id,
    label: commodity.name,
  }));
  // console.log("commodityOptions", commodityOptions);
  const [step, setStep] = useState(0);
  const { isSidebarCollapsed } = useContext(SidebarContext);

  useEffect(() => {
    if (shipment_id) {
      dispatch(fetchShipmentById(shipment_id));
    }
  }, [dispatch, shipment_id]);

  // Fetch commodity list only once on mount
  useEffect(() => {
    if (!commodities || commodities.length === 0) {
      dispatch(fetchCommodities(""));
    }
  }, [dispatch, commodities]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Shipment updated successfully!");
      dispatch(resetUpdateSuccess());
      navigate("/shipments/pending");
    }
  }, [updateSuccess, dispatch, navigate]);

  if (loading && !shipment) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!shipment) return <div>No shipment found.</div>;
  if (shipment.shipment_status?.toLowerCase() !== "pending") {
    return <div>Only shipments with status 'Pending' can be edited.</div>;
  }

  // Helper to get label from options
  const getOption = (
    options: Array<{ value: string; label: string }>,
    value: string | undefined
  ) => {
    if (!value) return null;
    return (
      options.find((opt) => String(opt.value) === String(value)) || {
        value,
        label: value,
      }
    );
  };
  const getMultiOptions = (
    options: Array<{ value: string; label: string }>,
    values: any
  ) => {
    if (!values) return [];
    // If already array of {value, label}, just return as is
    if (
      Array.isArray(values) &&
      values.length > 0 &&
      typeof values[0] === "object" &&
      "value" in values[0] &&
      "label" in values[0]
    ) {
      return values.map((item: any) => {
        // Find matching label from options if label is missing or is just the value
        const found = options.find(
          (opt) => String(opt.value) === String(item.value)
        );
        return found ? { value: item.value, label: found.label } : item;
      });
    }
    // If array of IDs
    if (Array.isArray(values)) {
      return values.map(
        (val) =>
          options.find((opt) => String(opt.value) === String(val)) || {
            value: val,
            label: val,
          }
      );
    }
    // If single string
    return [
      options.find((opt) => String(opt.value) === String(values)) || {
        value: values,
        label: values,
      },
    ];
  };

  // Initial values for Formik (fully dynamic from API response)
  const initialValues = {
    shipment_id: shipment?.shipment_id || "",
    cust_id: shipment?.cust_id || "",
    commodity: getMultiOptions(commodityOptions, shipment?.product_id),
    include_invoice_tax: shipment?.include_invoice_tax || "",
    category: getOption(categoryOptions, shipment?.category_id),
    category_id: shipment?.category_id || "",
    netWeight: shipment?.net_weight || "",
    net_weight: shipment?.net_weight || "",
    grossWeight: shipment?.gross_weight || "",
    gross_weight: shipment?.gross_weight || "",
    paymentMode: getOption(paymentModeOptions, shipment?.payment_mode),
    payment_mode: shipment?.payment_mode || "",
    sub_payment_mode: shipment?.sub_payment_mode || "",
    serviceType: getOption(serviceTypeOptions, shipment?.service_id),
    service_id: shipment?.service_id || "",
    invoiceValue: shipment?.invoice_value || "",
    invoice_value: shipment?.invoice_value || "",
    axlpl_insurance: shipment?.axlpl_insurance === "1",
    insurance: shipment?.axlpl_insurance === "1",
    shipment_status: shipment?.shipment_status || "",
    policyNumber: shipment?.policy_no || "",
    policy_no: shipment?.policy_no || "",
    expiryDate: shipment?.exp_date || "",
    exp_date: shipment?.exp_date || "",
    insuranceValue: shipment?.insurance_value || "",
    insurance_value: shipment?.insurance_value || "",
    remark: shipment?.remark || "",
    billTo: shipment?.bill_to === "2" ? "receiver" : "sender",
    bill_to: shipment?.bill_to || "",
    numberOfParcel: shipment?.number_of_parcel || "",
    number_of_parcel: shipment?.number_of_parcel || "",
    additionalAxlplInsurance: shipment?.additional_axlpl_insurance || "",
    additional_axlpl_insurance: shipment?.additional_axlpl_insurance || "",
    calculationStatus: shipment?.calculation_status || "",
    calculation_status: shipment?.calculation_status || "",
    createdDate: shipment?.created_date || "",
    created_date: shipment?.created_date || "",
    modifiedDate: shipment?.modified_date || "",
    modified_date: shipment?.modified_date || "",
    invoiceNumber: shipment?.shipment_invoice_no || "",
    invoice_number: shipment?.invoice_number || "",
    shipmentInvoiceNo: shipment?.shipment_invoice_no || "",
    shipment_invoice_no: shipment?.shipment_invoice_no || "",
    isAmtEditedByUser: shipment?.is_amt_edited_by_user === "1",
    is_amt_edited_by_user: shipment?.is_amt_edited_by_user || "",
    cashAmount: shipment?.cash_amount || "",
    cash_amount: shipment?.cash_amount || "",
    senderAddressType:
      shipment?.is_new_sender_address === "1" ? "new" : "existing",
    is_new_sender_address: shipment?.is_new_sender_address || "",
    senderCustomerId: shipment?.sender_customer_id || "",
    sender_customer_id: shipment?.sender_customer_id || "",
    senderName: shipment?.sender_name || "",
    sender_name: shipment?.sender_name || "",
    senderCompanyName: shipment?.sender_company_name || "",
    sender_company_name: shipment?.sender_company_name || "",
    senderCountry: shipment?.sender_country || "",
    sender_country: shipment?.sender_country || "",
    senderState: shipment?.sender_state || "",
    sender_state: shipment?.sender_state || "",
    senderCity: shipment?.sender_city || "",
    sender_city: shipment?.sender_city || "",
    senderArea: getOption(/* senderAreaOptions */ [], shipment?.sender_area), // TODO: pass senderAreaOptions if available
    sender_area: shipment?.sender_area || "",
    senderZipCode: shipment?.sender_pincode || "",
    sender_pincode: shipment?.sender_pincode || "",
    senderAddressLine1: shipment?.sender_address1 || "",
    sender_address1: shipment?.sender_address1 || "",
    senderAddressLine2: shipment?.sender_address2 || "",
    sender_address2: shipment?.sender_address2 || "",
    senderMobile: shipment?.sender_mobile || "",
    sender_mobile: shipment?.sender_mobile || "",
    senderEmail: shipment?.sender_email || "",
    sender_email: shipment?.sender_email || "",
    senderSaveAddress: shipment?.sender_saveaddress === "1",
    sender_saveaddress: shipment?.sender_saveaddress || "",
    senderGstNo: shipment?.sender_gst_no || "",
    sender_gst_no: shipment?.sender_gst_no || "",
    receiverAddressType:
      shipment?.is_new_receiver_address === "1" ? "new" : "existing",
    is_new_receiver_address: shipment?.is_new_receiver_address || "",
    receiverCustomerId: shipment?.receiver_customer_id || "",
    receiver_customer_id: shipment?.receiver_customer_id || "",
    receiverName: shipment?.receiver_name || "",
    receiver_name: shipment?.receiver_name || "",
    receiverCompanyName: shipment?.receiver_company_name || "",
    receiver_company_name: shipment?.receiver_company_name || "",
    receiverCountry: shipment?.receiver_country || "",
    receiver_country: shipment?.receiver_country || "",
    // receiverState: shipment?.receiver_state || "",
    // receiver_state: shipment?.receiver_state || "",
    // receiverCity: shipment?.receiver_city || "",
    // receiver_city: shipment?.receiver_city || "",
    // receiverArea: shipment?.receiver_area || "",
    // receiver_area: shipment?.receiver_area || "",
    receiverState: shipment?.receiver_state || "",
    receiver_state: shipment?.receiver_state || "",
    receiverCity: shipment?.receiver_city || "",
    receiver_city: shipment?.receiver_city || "",
    receiverArea: getOption(/* senderAreaOptions */ [], shipment?.receiver_area), // TODO: pass senderAreaOptions if available
    receiver_area: shipment?.receiver_area || "",
    receiverZipCode: shipment?.receiver_pincode || "",
    receiver_pincode: shipment?.receiver_pincode || "",
    receiverAddressLine1: shipment?.receiver_address1 || "",
    receiver_address1: shipment?.receiver_address1 || "",
    receiverAddressLine2: shipment?.receiver_address2 || "",
    receiver_address2: shipment?.receiver_address2 || "",
    receiverMobile: shipment?.receiver_mobile || "",
    receiver_mobile: shipment?.receiver_mobile || "",
    receiverEmail: shipment?.receiver_email || "",
    receiver_email: shipment?.receiver_email || "",
    receiverSaveAddress: shipment?.receiver_saveaddress === "1",
    receiver_saveaddress: shipment?.receiver_saveaddress || "",
    receiverGstNo: shipment?.receiver_gst_no || "",
    receiver_gst_no: shipment?.receiver_gst_no || "",
    // Delivery address (step 3)
    isDifferentDeliveryAddress: Boolean(
      shipment?.diffadd_country ||
        shipment?.diffadd_state ||
        shipment?.diffadd_city ||
        shipment?.diffadd_area ||
        shipment?.diffadd_pincode ||
        shipment?.diffadd_address1 ||
        shipment?.diffadd_address2
    ),
    deliveryCountry: shipment?.diffadd_country || "",
    deliveryState: shipment?.diffadd_state || "",
    deliveryCity: shipment?.diffadd_city || "",
    deliveryArea: shipment?.diffadd_area
      ? { value: shipment.diffadd_area, label: shipment.diffadd_area }
      : null,
    deliveryZipCode: shipment?.diffadd_pincode || "",
    deliveryAddressLine1: shipment?.diffadd_address1 || "",
    deliveryAddressLine2: shipment?.diffadd_address2 || "",
    // Charges
    cashCollectedBy: shipment?.cash_collected_by || "",
    shipmentCharges: shipment?.shipment_charges || "",
    insuranceCharges: shipment?.insurance_charges || "",
    invoiceCharges: shipment?.invoice_charges || "",
    handlingCharges: shipment?.handling_charges || "",
    tax: shipment?.tax || "",
    totalCharges: shipment?.total_charges || "",
    grandTotal: shipment?.grand_total || "",
    // Other fields
    deliveryDate: "",
    senderStateId: shipment?.sender_state || "",
    senderCityId: shipment?.sender_city || "",
    receiverStateId: shipment?.receiver_state || "",
    receiverCityId: shipment?.receiver_city || "",
  };
  console.log("initialValues log", initialValues);
  return (
    <div className="container-fluid p-0">
      <section
        className={`bodyWrap ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <Sidebar />
        <MainBody>
          <div className="multi-step-form-container">
            <div className="form-header">
              <div className="header-content">
                <h1 className="form-title">Edit Shipment</h1>
                <p className="form-subtitle">
                  Update the shipment details below
                </p>
              </div>
            </div>
            <div className="multi-step-progress">
              <div
                className="progress-container"
                style={
                  {
                    "--progress-width": `${(step / (steps.length - 1)) * 100}%`,
                  } as React.CSSProperties
                }
              >
                {steps.map((stepItem, index) => {
                  const isCompleted = index < step;
                  const isActive = index === step;
                  return (
                    <div key={index} className="progress-step">
                      <div
                        className={`step-circle ${
                          isCompleted ? "completed" : ""
                        } ${isActive ? "active" : ""}`}
                      >
                        {isCompleted ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="step-label">
                        <div
                          className={`step-title ${isActive ? "active" : ""} ${
                            isCompleted ? "completed" : ""
                          }`}
                        >
                          {stepItem.title}
                        </div>
                        <div className="step-subtitle">{stepItem.subtitle}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="form-content">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchemas[step]}
                onSubmit={async (values, formikHelpers) => {
                  try {
                    await validationSchemas[step].validate(values, {
                      abortEarly: false,
                    });
                  } catch (validationError: any) {
                    if (
                      validationError.errors &&
                      validationError.errors.length > 0
                    ) {
                      const errorMessage = `Please fix the following errors:\n${validationError.errors.join(
                        "\n"
                      )}`;
                      toast.error(errorMessage);
                    }
                    return;
                  }
                  if (step === 1) {
                    const criticalFieldErrors =
                      validateStep2CriticalFields(values);
                    if (criticalFieldErrors.length > 0) {
                      const errorMessage = `Please fix the following critical validation errors before proceeding:\n${criticalFieldErrors.join(
                        "\n"
                      )}`;
                      toast.error(errorMessage);
                      return;
                    }
                  }
                  if (step === steps.length - 1) {
                    // Prepare only required fields for payload
                    const payload: Record<string, any> = {
                      customer_id: values.cust_id || "",
                      category_id: values.category && typeof values.category === "object" ? values.category.value : values.category_id,
                      shipment_id: values.shipment_id,
                      net_weight: values.netWeight || values.net_weight,
                      gross_weight: values.grossWeight || values.gross_weight,
                      payment_mode: values.paymentMode && typeof values.paymentMode === "object" ? values.paymentMode.value : values.payment_mode,
                      service_id: values.serviceType && typeof values.serviceType === "object" ? values.serviceType.value : values.service_id,
                      invoice_value: values.invoiceValue || values.invoice_value,
                      axlpl_insurance: values.insurance ? "1" : "0",
                      bill_to: values.billTo === "receiver" ? "2" : "1",
                      number_of_parcel: values.numberOfParcel || values.number_of_parcel,
                      additional_axlpl_insurance: values.additionalAxlplInsurance || values.additional_axlpl_insurance || "",
                      shipment_invoice_no: values.invoiceNumber || values.shipment_invoice_no,
                      sender_is_new_sender_address: values.senderAddressType === "new" ? "1" : "0",
                      sender_name: values.senderName,
                      sender_company_name: values.senderCompanyName,
                      sender_country: values.senderCountry || "India",
                      sender_state: values.senderStateId || (values.senderState && typeof values.senderState === "object" ? (values.senderState as any).value : values.senderState),
                      sender_city: values.senderCityId || (values.senderCity && typeof values.senderCity === "object" ? (values.senderCity as any).value : values.senderCity),
                      sender_area: values.senderArea && typeof values.senderArea === "object" ? values.senderArea.value : values.senderArea || "",
                      sender_pincode: values.senderZipCode,
                      sender_address1: values.senderAddressLine1,
                      sender_address2: values.senderAddressLine2,
                      sender_mobile: values.senderMobile,
                      sender_email: values.senderEmail,
                      sender_gst_no: values.senderGstNo,
                      sender_customer_id: values.senderCustomerId || "",
                      receiver_is_new_receiver_address: values.receiverAddressType === "new" ? "1" : "0",
                      receiver_name: values.receiverName,
                      receiver_company_name: values.receiverCompanyName,
                      receiver_country: values.receiverCountry || "India",
                      receiver_state: values.receiverStateId || (values.receiverState && typeof values.receiverState === "object" ? (values.receiverState as any).value : values.receiverState),
                      receiver_city: values.receiverCityId || (values.receiverCity && typeof values.receiverCity === "object" ? (values.receiverCity as any).value : values.receiverCity),
                      receiver_area: values.receiverArea && typeof values.receiverArea === "object" ? values.receiverArea.value : values.receiverArea || "",
                      receiver_pincode: values.receiverZipCode,
                      receiver_address1: values.receiverAddressLine1,
                      receiver_address2: values.receiverAddressLine2,
                      receiver_mobile: values.receiverMobile,
                      receiver_email: values.receiverEmail,
                      receiver_gst_no: values.receiverGstNo,
                      receiver_customer_id: values.receiverCustomerId || "",
                      is_diff_add: values.isDifferentDeliveryAddress ? "1" : "0",
                      diff_receiver_country: values.deliveryCountry || "",
                      diff_receiver_state: values.deliveryState || "",
                      diff_receiver_city: values.deliveryCity || "",
                      diff_receiver_area: values.deliveryArea && typeof values.deliveryArea === "object" ? values.deliveryArea.value : values.deliveryArea || "",
                      diff_receiver_address1: values.deliveryAddressLine1 || "",
                      diff_receiver_address2: values.deliveryAddressLine2 || "",
                      diff_receiver_pincode: values.deliveryZipCode || "",
                      shipment_charges: values.shipmentCharges || "",
                      insurance_charges: values.insuranceCharges || "",
                      invoice_charges: values.invoiceCharges || "",
                      handling_charges: values.handlingCharges || "",
                      tax: values.tax || "",
                      total_charges: values.totalCharges || "",
                      gst_amount: "", // Not present in current form values
                      grand_total: values.grandTotal || "",
                      remark: values.remark || "",
                      invoice_number: values.invoiceNumber || values.invoice_number || "",
                      added_by: "", // Not present in current form values
                      added_by_type: "", // Not present in current form values
                      calculation_status: values.calculationStatus || values.calculation_status || "",
                      is_amt_edited_by_user: values.isAmtEditedByUser ? "1" : "0",
                      shipment_status: values.shipment_status || "pending",
                      pre_alert_shipment: "" // Not present in current form values
                    };

                    // Submit update with only required fields
                    const formData = new FormData();
                    Object.entries(payload).forEach(([key, value]) => {
                      formData.append(key, String(value));
                    });
                    dispatch(updateShipment(formData));
                  } else {
                    setStep(step + 1);
                  }
                }}
                enableReinitialize
              >
                {({
                  values,
                  setFieldValue,
                  setFieldTouched,
                  setFieldError,
                  errors,
                  touched,
                }) => (
                  <Form className="multi-step-form" noValidate>
                    <div className="step-content">
                      <div className="step-header">
                        <div className="step-icon">{steps[step].icon}</div>
                        <div className="step-info">
                          <h2 className="step-title">{steps[step].title}</h2>
                          <p className="step-subtitle">
                            {steps[step].subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="step-fields row row-gap-4">
                        {step === 0 && (
                          <StepOneFormFields
                            values={{ ...values, commodity: values.commodity }}
                            setFieldValue={setFieldValue}
                            errors={errors}
                            touched={touched}
                            categoryOptions={categoryOptions}
                            paymentModeOptions={paymentModeOptions}
                            serviceTypeOptions={serviceTypeOptions}
                            commodityOptions={commodityOptions}
                          />
                        )}
                        {step === 1 && (
                          <StepTwoFormFields
                            values={values}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            setFieldError={setFieldError}
                            errors={errors}
                            touched={touched}
                          />
                        )}
                        {step === 2 && (
                          <StepThreeFormFields
                            values={values}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            setFieldError={setFieldError}
                            errors={errors}
                            touched={touched}
                          />
                        )}
                        {step === 3 && (
                          <StepFourFormFields
                            values={values}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            setFieldError={setFieldError}
                            errors={errors}
                            touched={touched}
                          />
                        )}
                      </div>
                    </div>
                    <FormNavigation
                      step={step}
                      stepsLength={steps.length}
                      onBack={() => {
                        setStep(step - 1);
                      }}
                      isLastStep={step === steps.length - 1}
                      isSubmitting={loading}
                    />
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </MainBody>
      </section>
    </div>
  );
};

export default EditShipment;
