import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useState, useContext, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import { RootState } from "../redux/store";
import { resetFormData, setFormData } from "../redux/slices/shipmentSlice";
import * as Yup from "yup";
import StepOneFormFields from "../components/pagecomponents/addshipmentpage/StepOneFormFields";
import StepTwoFormFields from "../components/pagecomponents/addshipmentpage/StepTwoFormFields";
import StepThreeFormFields from "../components/pagecomponents/addshipmentpage/StepThreeFormFields";
import StepFourFormFields from "../components/pagecomponents/addshipmentpage/StepFourFormFields";
import FormNavigation from "../components/pagecomponents/addshipmentpage/FormNavigation";
import { SidebarContext } from "../contexts/SidebarContext";
import "../assets/style/AddShipment.scss";
import { fetchShipmentById, updateShipment } from "../redux/slices/editShipmentSlice";

const steps = [
  {
    title: "Shipment Details",
    subtitle: "Basic shipment information",
    icon: "📦"
  },
  {
    title: "Address Information",
    subtitle: "Pickup and delivery addresses",
    icon: "📍"
  },
  {
    title: "Delivery Options",
    subtitle: "Different delivery address",
    icon: "🚚"
  },
  {
    title: "Review & Confirm",
    subtitle: "Review and update your shipment",
    icon: "✅"
  }
];

const EditShipment = () => {
  const [step, setStep] = useState(0);
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.shipment);
  const { shipment, loading, error } = useSelector((state: RootState) => state.editShipment);
  const { isSidebarCollapsed } = useContext(SidebarContext);

  // Fetch shipment data on component mount (only if not already in store)
  useEffect(() => {
    if (shipmentId) {
      // If shipment data is not already in store, fetch it
      if (!shipment) {
        dispatch(fetchShipmentById(shipmentId) as any);
      }
    } else {
      navigate('/shipments/approved');
    }
  }, [dispatch, shipmentId, navigate, shipment]);

  // Reset form data on component mount
  useEffect(() => {
    dispatch(resetFormData());
  }, [dispatch]);

  // Check if shipment is active/approved (only allow editing active shipments)
  useEffect(() => {
    if (shipment && shipment.shipment_status?.toLowerCase() !== 'approved') {
      alert('Only active shipments can be edited');
      navigate('/shipments/approved');
    }
  }, [shipment, navigate]);

  // Create initial values using useMemo to ensure they update when shipment data changes
  const initialValues = useMemo(() => {
    return {
      // Step 1: Shipment Details
      name: shipment?.sender_company_name || "",
      category: shipment?.category || null,
      commodity: Array.isArray(shipment?.commodity) ? shipment.commodity : [],
      netWeight: shipment?.net_weight || shipment?.weight || "",
      grossWeight: shipment?.gross_weight || "",
      paymentMode: shipment?.payment_mode || null,
      numberOfParcel: shipment?.number_of_parcel || shipment?.parcel_count || "1",
      serviceType: shipment?.service_type || null,
      insurance: shipment?.insurance === true || shipment?.insurance === "true" || false,
      expiryDate: shipment?.expiry_date || "",
      policyNumber: shipment?.policy_number || "",
      insuranceValue: shipment?.insurance_value || "",
      invoiceValue: shipment?.invoice_value || "",
      remark: shipment?.remark || shipment?.remarks || "",

      // Step 2: Address Information
      senderAddressType: "existing",
      senderName: shipment?.sender_name || "",
      senderCompanyName: shipment?.sender_company_name || "",
      senderZipCode: shipment?.sender_zip_code || "",
      senderState: shipment?.sender_state || "",
      senderCity: shipment?.sender_city || shipment?.origin || "",
      senderArea: shipment?.sender_area || shipment?.sender_areaname || null,
      senderGstNo: shipment?.sender_gst_no || "",
      senderAddressLine1: shipment?.sender_address_line1 || shipment?.sender_address || "",
      senderAddressLine2: shipment?.sender_address_line2 || "",
      senderMobile: shipment?.sender_mobile || shipment?.sender_phone || "",
      senderEmail: shipment?.sender_email || "",

      billTo: shipment?.bill_to || "sender",

      receiverAddressType: "existing",
      receiverName: shipment?.receiver_name || "",
      receiverCompanyName: shipment?.receiver_company_name || "",
      receiverZipCode: shipment?.receiver_zip_code || "",
      receiverState: shipment?.receiver_state || "",
      receiverCity: shipment?.receiver_city || shipment?.destination || "",
      receiverArea: shipment?.receiver_area || shipment?.receiver_areaname || null,
      receiverGstNo: shipment?.receiver_gst_no || "",
      receiverAddressLine1: shipment?.receiver_address_line1 || shipment?.receiver_address || "",
      receiverAddressLine2: shipment?.receiver_address_line2 || "",
      receiverMobile: shipment?.receiver_mobile || shipment?.receiver_phone || "",
      receiverEmail: shipment?.receiver_email || "",

      // Step 3: Delivery Address
      isDifferentDeliveryAddress: shipment?.is_different_delivery_address === true || false,
      deliveryZipCode: shipment?.delivery_zip_code || "",
      deliveryState: shipment?.delivery_state || "",
      deliveryCity: shipment?.delivery_city || "",
      deliveryArea: shipment?.delivery_area || null,
      deliveryAddressLine1: shipment?.delivery_address_line1 || "",
      deliveryAddressLine2: shipment?.delivery_address_line2 || "",

      // Step 4: Additional Information
      specialInstructions: shipment?.special_instructions || shipment?.instructions || "",
      pickupDate: shipment?.pickup_date || shipment?.created_date || "",
      deliveryDate: shipment?.delivery_date || shipment?.expected_delivery || "",
    };
  }, [shipment]); // Recalculate when shipment data changes

  const validationSchemas = [
    // Step 1: Shipment Details (Original Fields)
    Yup.object({
      name: Yup.string().required("Name is required"),
      category: Yup.object().nullable().required("Please select category"),
      commodity: Yup.array().min(1, "Please select at least one commodity"),
      netWeight: Yup.number().positive("Net weight must be positive").required("Net weight is required"),
      grossWeight: Yup.number().positive("Gross weight must be positive").required("Gross weight is required"),
      paymentMode: Yup.object().nullable().required("Please select payment mode"),
      numberOfParcel: Yup.number().positive("Number of parcels must be positive").required("Number of parcels is required"),
      serviceType: Yup.object().nullable().required("Please select service type"),
      invoiceValue: Yup.number().positive("Invoice value must be positive").required("Invoice value is required"),
    }),

    // Step 2: Address Information
    Yup.object({
      senderAddressType: Yup.string().oneOf(["new", "existing"], "Invalid address type"),

      // Sender Information Validation
      senderName: Yup.string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters")
        .matches(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters, spaces, dots, apostrophes, and hyphens")
        .required("Sender name is required"),

      senderCompanyName: Yup.string()
        .trim()
        .min(2, "Company name must be at least 2 characters")
        .max(200, "Company name cannot exceed 200 characters")
        .required("Company name is required"),

      senderZipCode: Yup.string()
        .trim()
        .matches(/^\d{6}$/, "Zip code must be exactly 6 digits")
        .required("Zip code is required"),

      senderState: Yup.string()
        .trim()
        .min(2, "State must be at least 2 characters")
        .max(50, "State cannot exceed 50 characters")
        .matches(/^[a-zA-Z\s.-]+$/, "State can only contain letters, spaces, dots, and hyphens")
        .required("State is required"),

      senderCity: Yup.string()
        .trim()
        .min(2, "City must be at least 2 characters")
        .max(100, "City cannot exceed 100 characters")
        .matches(/^[a-zA-Z\s.-]+$/, "City can only contain letters, spaces, dots, and hyphens")
        .required("City is required"),

      senderGstNo: Yup.string()
        .trim()
        .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format")
        .nullable(),

      senderAddressLine1: Yup.string()
        .trim()
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address cannot exceed 200 characters")
        .required("Address line 1 is required"),

      senderAddressLine2: Yup.string()
        .trim()
        .max(200, "Address cannot exceed 200 characters")
        .nullable(),

      senderMobile: Yup.string()
        .trim()
        .matches(/^[6-9]\d{9}$/, "Mobile number must be 10 digits starting with 6, 7, 8, or 9")
        .required("Mobile number is required"),

      senderEmail: Yup.string()
        .trim()
        .email("Invalid email format")
        .max(100, "Email cannot exceed 100 characters")
        .required("Email is required"),

      // Receiver Information Validation
      receiverAddressType: Yup.string().oneOf(["new", "existing"], "Invalid address type"),

      receiverName: Yup.string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters")
        .matches(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters, spaces, dots, apostrophes, and hyphens")
        .required("Receiver name is required"),

      receiverCompanyName: Yup.string()
        .trim()
        .min(2, "Company name must be at least 2 characters")
        .max(200, "Company name cannot exceed 200 characters")
        .required("Company name is required"),

      receiverZipCode: Yup.string()
        .trim()
        .matches(/^\d{6}$/, "Zip code must be exactly 6 digits")
        .required("Zip code is required"),

      receiverState: Yup.string()
        .trim()
        .min(2, "State must be at least 2 characters")
        .max(50, "State cannot exceed 50 characters")
        .matches(/^[a-zA-Z\s.-]+$/, "State can only contain letters, spaces, dots, and hyphens")
        .required("State is required"),

      receiverCity: Yup.string()
        .trim()
        .min(2, "City must be at least 2 characters")
        .max(100, "City cannot exceed 100 characters")
        .matches(/^[a-zA-Z\s.-]+$/, "City can only contain letters, spaces, dots, and hyphens")
        .required("City is required"),

      receiverGstNo: Yup.string()
        .trim()
        .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format")
        .nullable(),

      receiverAddressLine1: Yup.string()
        .trim()
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address cannot exceed 200 characters")
        .required("Address line 1 is required"),

      receiverAddressLine2: Yup.string()
        .trim()
        .max(200, "Address cannot exceed 200 characters")
        .nullable(),

      receiverMobile: Yup.string()
        .trim()
        .matches(/^[6-9]\d{9}$/, "Mobile number must be 10 digits starting with 6, 7, 8, or 9")
        .required("Mobile number is required"),

      receiverEmail: Yup.string()
        .trim()
        .email("Invalid email format")
        .max(100, "Email cannot exceed 100 characters")
        .required("Email is required"),
    }),

    // Step 3: Delivery Address
    Yup.object({
      // Conditional validation for delivery address fields
      deliveryZipCode: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema
          .trim()
          .matches(/^\d{6}$/, "Delivery zip code must be exactly 6 digits")
          .required("Delivery zip code is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      deliveryState: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema
          .trim()
          .min(2, "Delivery state must be at least 2 characters")
          .max(50, "Delivery state cannot exceed 50 characters")
          .matches(/^[a-zA-Z\s.-]+$/, "Delivery state can only contain letters, spaces, dots, and hyphens")
          .required("Delivery state is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      deliveryCity: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema
          .trim()
          .min(2, "Delivery city must be at least 2 characters")
          .max(100, "Delivery city cannot exceed 100 characters")
          .matches(/^[a-zA-Z\s.-]+$/, "Delivery city can only contain letters, spaces, dots, and hyphens")
          .required("Delivery city is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      deliveryAddressLine1: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema
          .trim()
          .min(5, "Delivery address must be at least 5 characters")
          .max(200, "Delivery address cannot exceed 200 characters")
          .required("Delivery address line 1 is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      deliveryAddressLine2: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema
          .trim()
          .max(200, "Delivery address cannot exceed 200 characters")
          .nullable(),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),

    // Step 4: Review & Confirmation
    Yup.object({
      pickupDate: Yup.date().required("Pickup date is required"),
    }),
  ];

  const handleSubmit = async (values: any) => {
    if (!shipmentId) return;

    try {
      await dispatch(updateShipment({
        shipmentId,
        shipmentData: values
      }) as any);

      dispatch(resetFormData());
      alert(`Shipment ${shipmentId} updated successfully!`);
      navigate('/shipments/approved');
    } catch (error) {
      console.error("Error updating shipment:", error);
      alert("Failed to update shipment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-0">
        <section className={`bodyWrap ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar />
          <MainBody>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
              <div className="loader" />
            </div>
          </MainBody>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-0">
        <section className={`bodyWrap ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar />
          <MainBody>
            <div className="alert alert-danger m-4">
              <h4>Error Loading Shipment</h4>
              <p>{error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/shipments/approved')}
              >
                Back to Shipments
              </button>
            </div>
          </MainBody>
        </section>
      </div>
    );
  }

  // Don't render the form until we have shipment data (unless there's an error)
  if (!shipment && !loading && !error) {
    return (
      <div className="container-fluid p-0">
        <section className={`bodyWrap ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar />
          <MainBody>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading shipment data...</p>
              </div>
            </div>
          </MainBody>
        </section>
      </div>
    );
  }

  if (!shipment && !loading) {
    return (
      <div className="container-fluid p-0">
        <section className={`bodyWrap ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar />
          <MainBody>
            <div className="alert alert-warning m-4">
              <h4>Shipment Not Found</h4>
              <p>The shipment with ID {shipmentId} was not found.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/shipments/approved')}
              >
                Back to Shipments
              </button>
            </div>
          </MainBody>
        </section>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <section className={`bodyWrap ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar />
        <MainBody>
          <div className="multi-step-form-container">
            {/* Enhanced Header */}
            <div className="form-header">
              <div className="header-content">
                <h1 className="form-title">Edit Shipment #{shipmentId}</h1>
                <p className="form-subtitle">
                  Update the shipment details below
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="multi-step-progress">
              <div className="progress-container" style={{ '--progress-width': `${(step / (steps.length - 1)) * 100}%` } as React.CSSProperties}>
                {steps.map((stepItem, index) => {
                  const isCompleted = index < step;
                  const isActive = index === step;

                  return (
                    <div key={index} className="progress-step">
                      <div className={`step-circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                        {isCompleted ? (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="step-label">
                        <div className={`step-title ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                          {stepItem.title}
                        </div>
                        <div className="step-subtitle">{stepItem.subtitle}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <div className="form-content">
              <Formik
                key={shipment?.shipment_id || 'no-shipment'} // Force re-initialization when shipment changes
                initialValues={initialValues}
                validationSchema={validationSchemas[step]}
                onSubmit={(values) => {
                  dispatch(setFormData(values));
                  if (step === steps.length - 1) {
                    handleSubmit(values);
                  } else {
                    setStep(step + 1);
                  }
                }}
                enableReinitialize={true}
              >
                {({ values, setFieldValue, setFieldTouched, setFieldError, errors, touched }) => {


                  return (
                    <Form className="multi-step-form" noValidate>
                      <div className="step-content">
                        <div className="step-header d-flex align-items-center">
                          <div className="step-icon">{steps[step].icon}</div>
                          <div className="step-info">
                            <h2 className="step-title">{steps[step].title}</h2>
                            <p className="step-subtitle">{steps[step].subtitle}</p>
                          </div>
                        </div>

                      <div className="step-fields row row-gap-4">
                        {step === 0 && (
                          <StepOneFormFields
                            values={values}
                            setFieldValue={setFieldValue}
                            errors={errors}
                            touched={touched}
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
                      onBack={() => setStep(step - 1)}
                      isLastStep={step === steps.length - 1}
                      submitText="Update Shipment"
                    />
                  </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </MainBody>
      </section>
    </div>
  );
};

export default EditShipment;
