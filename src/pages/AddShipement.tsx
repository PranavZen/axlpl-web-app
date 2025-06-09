import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import { RootState, AppDispatch } from "../redux/store";
import { resetFormData, setFormData, submitShipment, clearSubmitState } from "../redux/slices/shipmentSlice";
import * as Yup from "yup";
import StepOneFormFields from "../components/pagecomponents/addshipmentpage/StepOneFormFields";
import StepTwoFormFields from "../components/pagecomponents/addshipmentpage/StepTwoFormFields";
import StepThreeFormFields from "../components/pagecomponents/addshipmentpage/StepThreeFormFields";
import StepFourFormFields from "../components/pagecomponents/addshipmentpage/StepFourFormFields";
import FormNavigation from "../components/pagecomponents/addshipmentpage/FormNavigation";
import { SidebarContext } from "../contexts/SidebarContext";
import "../assets/style/AddShipment.scss";

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
    subtitle: "Review and submit your shipment",
    icon: "✅"
  }
];

const AddShipment = () => {
  const [step, setStep] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const { submitting, submitError, submitSuccess, submittedShipmentId } = useSelector((state: RootState) => state.shipment);
  const { isSidebarCollapsed } = useContext(SidebarContext);

  // Reset form data on component mount to ensure clean state
  useEffect(() => {
    dispatch(resetFormData());
  }, [dispatch]);

  const initialValues = {
    // Step 1: Shipment Details (Original Fields)
    name: "",
    category: null,
    commodity: [],
    netWeight: "",
    grossWeight: "",
    paymentMode: null,
    numberOfParcel: "",
    serviceType: null,
    insurance: false,
    expiryDate: "",
    policyNumber: "",
    insuranceValue: "",
    invoiceValue: "",
    remark: "",

    // Step 2: Address Information
    senderAddressType: "existing",
    senderName: "",
    senderCompanyName: "",
    senderZipCode: "",
    senderState: "",
    senderCity: "",
    senderArea: null,
    senderGstNo: "",
    senderAddressLine1: "",
    senderAddressLine2: "",
    senderMobile: "",
    senderEmail: "",

    billTo: "sender",

    receiverAddressType: "new",
    receiverName: "",
    receiverCompanyName: "",
    receiverZipCode: "",
    receiverState: "",
    receiverCity: "",
    receiverArea: null,
    receiverGstNo: "",
    receiverAddressLine1: "",
    receiverAddressLine2: "",
    receiverMobile: "",
    receiverEmail: "",

    // Step 3: Delivery Address
    isDifferentDeliveryAddress: false,
    deliveryZipCode: "",
    deliveryState: "",
    deliveryCity: "",
    deliveryArea: null,
    deliveryAddressLine1: "",
    deliveryAddressLine2: "",

    // Step 4: Additional Information
    specialInstructions: "",
    pickupDate: "",
    deliveryDate: "",
  };

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
      senderAddressType: Yup.string().oneOf(["new", "existing"], "Invalid sender address type").required("Please select sender address type"),
      receiverAddressType: Yup.string().oneOf(["new", "existing"], "Invalid receiver address type").required("Please select receiver address type"),

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

      senderArea: Yup.object()
        .nullable(),

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

      receiverArea: Yup.object()
        .nullable(),

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

      billTo: Yup.string()
        .oneOf(["sender", "receiver"], "Please select who to bill")
        .required("Please select billing option"),
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

  const handleSubmit = async (values: any, { resetForm }: any) => {
    console.log("🚀 handleSubmit called with values:", values);
    try {
      // Show loading toast
      const loadingToast = toast.loading("Submitting shipment...");

      console.log("📤 Dispatching submitShipment...");
      // Submit the shipment
      const result = await dispatch(submitShipment(values));
      console.log("📥 submitShipment result:", result);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (submitShipment.fulfilled.match(result)) {
        // Success - Clear form and show success message
        const shipmentId = result.payload.shipmentId;
        toast.success(`Shipment submitted successfully! ${shipmentId ? `Shipment ID: ${shipmentId}` : ''}`);

        // 1. Reset Redux form data
        dispatch(resetFormData());

        // 2. Reset Formik form to initial values
        resetForm();

        // 3. Reset step to 0
        setStep(0);

      } else {
        // Error
        const errorMessage = result.payload as string || "Failed to submit shipment";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  // Handle submission state changes
  useEffect(() => {
    if (submitSuccess && submittedShipmentId) {
      // Clear submit state after showing success
      setTimeout(() => {
        dispatch(clearSubmitState());
      }, 3000);
    }

    if (submitError) {
      // Clear error state after some time
      setTimeout(() => {
        dispatch(clearSubmitState());
      }, 5000);
    }
  }, [submitSuccess, submitError, submittedShipmentId, dispatch]);

  return (
      <div className="container-fluid p-0">
        <section className={`bodyWrap ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar />
          <MainBody>
            <div className="multi-step-form-container">
              {/* Enhanced Header */}
              <div className="form-header">
                <div className="header-content">
                  <h1 className="form-title">Create New Shipment</h1>
                  <p className="form-subtitle">
                    Complete the following steps to create your shipment
                  </p>
                </div>
                {/* <div className="step-indicator">
                  <span className="current-step">Step {step + 1}</span>
                  <span className="total-steps">of {steps.length}</span>
                </div> */}
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
                  initialValues={initialValues}
                  validationSchema={validationSchemas[step]}
                  onSubmit={async (values, formikHelpers) => {
                    console.log("📝 Formik onSubmit called - Step:", step, "Values:", values);
                    console.log("🔍 Current validation schema:", validationSchemas[step]);

                    // Check for validation errors
                    try {
                      await validationSchemas[step].validate(values, { abortEarly: false });
                      console.log("✅ Validation passed for step", step);
                    } catch (validationError: any) {
                      console.log("❌ Validation failed for step", step, "Errors:", validationError.errors);
                      console.log("❌ Validation error details:", validationError);
                      return; // Don't proceed if validation fails
                    }

                    dispatch(setFormData(values));
                    if (step === steps.length - 1) {
                      console.log("✅ Last step reached, calling handleSubmit");
                      await handleSubmit(values, formikHelpers);
                    } else {
                      console.log("➡️ Moving to next step:", step + 1);
                      setStep(step + 1);
                    }
                  }}
                  enableReinitialize
                >
                  {({ values, setFieldValue, setFieldTouched, setFieldError, errors, touched }) => {
                    // Debug: Log current form state for step 2
                    if (step === 1) {
                      console.log("🔍 Step 2 Form State:");
                      console.log("Values:", values);
                      console.log("Errors:", errors);
                      console.log("Touched:", touched);
                    }

                    return (
                    <Form className="multi-step-form" noValidate>
                      <div className="step-content">
                        <div className="step-header">
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
                        isSubmitting={submitting}
                      />

                      {/* Temporary Debug Button for Step 2 */}
                      {step === 1 && (
                        <div className="mt-3">
                          <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => {
                              console.log("🔧 Debug: Force moving to step 3");
                              console.log("🔧 Current values:", values);
                              console.log("🔧 Current errors:", errors);
                              setStep(2);
                            }}
                          >
                            🔧 Debug: Force Next Step
                          </button>
                        </div>
                      )}
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

export default AddShipment;
