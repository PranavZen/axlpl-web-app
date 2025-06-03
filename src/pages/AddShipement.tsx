import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useState, useContext, useEffect } from "react";
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
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.shipment);
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
    senderState: null,
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
    receiverState: null,
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
    deliveryState: null,
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
      senderAddressType: Yup.string().oneOf(["new", "existing"], "Invalid address type"),
      senderName: Yup.string().required("Sender name is required"),
      senderCompanyName: Yup.string().required("Company name is required"),
      senderZipCode: Yup.string().required("Zip code is required"),
      senderState: Yup.object().nullable().required("Please select state"),
      senderCity: Yup.string().required("City is required"),
      senderAddressLine1: Yup.string().required("Address line 1 is required"),
      senderMobile: Yup.string().required("Mobile number is required"),
      senderEmail: Yup.string().email("Invalid email").required("Email is required"),

      receiverAddressType: Yup.string().oneOf(["new", "existing"], "Invalid address type"),
      receiverName: Yup.string().required("Receiver name is required"),
      receiverCompanyName: Yup.string().required("Company name is required"),
      receiverZipCode: Yup.string().required("Zip code is required"),
      receiverState: Yup.object().nullable().required("Please select state"),
      receiverCity: Yup.string().required("City is required"),
      receiverAddressLine1: Yup.string().required("Address line 1 is required"),
      receiverMobile: Yup.string().required("Mobile number is required"),
      receiverEmail: Yup.string().email("Invalid email").required("Email is required"),
    }),

    // Step 3: Delivery Address
    Yup.object({
      // Conditional validation for delivery address fields
      deliveryZipCode: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema.required("Delivery zip code is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      deliveryState: Yup.object().nullable().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema.required("Please select delivery state"),
        otherwise: (schema) => schema.notRequired(),
      }),
      deliveryCity: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema.required("Delivery city is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      deliveryAddressLine1: Yup.string().when('isDifferentDeliveryAddress', {
        is: true,
        then: (schema) => schema.required("Delivery address line 1 is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),

    // Step 4: Review & Confirmation
    Yup.object({
      pickupDate: Yup.date().required("Pickup date is required"),
    }),
  ];

  const handleSubmit = (values: any) => {
    dispatch(resetFormData());
    console.log("Submit to API", values);
    // Add your API submission logic here
  };

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
                  onSubmit={(values) => {
                    dispatch(setFormData(values));
                    if (step === steps.length - 1) {
                      handleSubmit(values);
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  enableReinitialize
                >
                  {({ values, setFieldValue, setFieldTouched, setFieldError, errors, touched }) => (
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

export default AddShipment;
