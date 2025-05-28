import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import { RootState } from "../redux/store";
import { resetFormData, setFormData } from "../redux/slices/shipmentSlice";
import * as Yup from "yup";
import StepOneFormFields from "../components/pagecomponents/addshipmentpage/StepOneFormFields";
// import StepTwoFormFields from "../components/pagecomponents/addshipmentpage/StepTwoFormFields";
// import StepThreeFormFields from "../components/pagecomponents/addshipmentpage/StepThreeFormFields";
// import StepFourFormFields from "../components/pagecomponents/addshipmentpage/StepFourFormFields";
import FormNavigation from "../components/pagecomponents/addshipmentpage/FormNavigation";
// import MultiStepProgress from "../components/pagecomponents/addshipmentpage/MultiStepProgress";
import "./AddShipment.scss";

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
    title: "Package Details",
    subtitle: "Weight, dimensions & insurance",
    icon: "📏"
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

  const initialValues = {
    // Step 1: Shipment Details (Original Fields)
    name: "",
    category: null,
    commodity: [],
    netWeight: "",
    grossWeight: "",
    paymentMode: [],
    numberOfParcel: "",
    serviceType: [],
    insurance: false,
    expiryDate: "",
    policyNumber: "",
    insuranceValue: "",
    invoiceValue: "",
    remark: "",

    // Step 2: Address Information
    pickupAddress: {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      landmark: ""
    },
    deliveryAddress: {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      landmark: ""
    },

    // Step 3: Package Details
    packageDetails: {
      weight: "",
      length: "",
      width: "",
      height: "",
      quantity: "1",
      value: "",
      description: "",
      fragile: false,
      insurance: false,
      insuranceValue: ""
    },

    // Step 4: Additional Information
    specialInstructions: "",
    pickupDate: "",
    deliveryDate: "",

    ...formData,
  };

  const validationSchemas = [
    // Step 1: Shipment Details (Original Fields)
    Yup.object({
      name: Yup.string().required("Name is required"),
      category: Yup.object().nullable().required("Please select category"),
      commodity: Yup.array().min(1, "Please select at least one commodity"),
      netWeight: Yup.number().positive("Net weight must be positive").required("Net weight is required"),
      grossWeight: Yup.number().positive("Gross weight must be positive").required("Gross weight is required"),
      paymentMode: Yup.array().min(1, "Please select at least one payment mode"),
      numberOfParcel: Yup.number().positive("Number of parcels must be positive").required("Number of parcels is required"),
      serviceType: Yup.array().min(1, "Please select at least one service type"),
      invoiceValue: Yup.number().positive("Invoice value must be positive").required("Invoice value is required"),
    }),

    // Step 2: Address Information
    Yup.object({
      pickupAddress: Yup.object({
        name: Yup.string().required("Pickup contact name is required"),
        phone: Yup.string().required("Phone number is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        pincode: Yup.string().required("Pincode is required"),
      }),
      deliveryAddress: Yup.object({
        name: Yup.string().required("Delivery contact name is required"),
        phone: Yup.string().required("Phone number is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        pincode: Yup.string().required("Pincode is required"),
      }),
    }),

    // Step 3: Package Details
    Yup.object({
      packageDetails: Yup.object({
        weight: Yup.number().positive("Weight must be positive").required("Weight is required"),
        length: Yup.number().positive("Length must be positive").required("Length is required"),
        width: Yup.number().positive("Width must be positive").required("Width is required"),
        height: Yup.number().positive("Height must be positive").required("Height is required"),
        quantity: Yup.number().positive("Quantity must be positive").required("Quantity is required"),
        value: Yup.number().positive("Value must be positive").required("Package value is required"),
        description: Yup.string().required("Package description is required"),
      }),
    }),

    // Step 4: Review & Confirmation
    Yup.object({
      paymentMode: Yup.object().nullable().required("Please select payment mode"),
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
        <section className="bodyWrap">
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
                  {({ values, setFieldValue, errors, touched }) => (
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
                            <div className="step-two-fields">
                              <div className="address-section">
                                <div className="section-header">
                                  <div className="section-icon">📍</div>
                                  <div className="section-info">
                                    <h3 className="section-title">Address Information</h3>
                                    <p className="section-description">Enter pickup and delivery addresses</p>
                                  </div>
                                </div>
                                <p>Step 2 content will be implemented here...</p>
                              </div>
                            </div>
                          )}
                          {step === 2 && (
                            <div className="step-three-fields">
                              <div className="package-section">
                                <div className="section-header">
                                  <div className="section-icon">📦</div>
                                  <div className="section-info">
                                    <h3 className="section-title">Package Details</h3>
                                    <p className="section-description">Enter package dimensions and details</p>
                                  </div>
                                </div>
                                <p>Step 3 content will be implemented here...</p>
                              </div>
                            </div>
                          )}
                          {step === 3 && (
                            <div className="step-four-fields">
                              <div className="summary-section">
                                <div className="section-header">
                                  <div className="section-icon">✅</div>
                                  <div className="section-info">
                                    <h3 className="section-title">Review & Confirmation</h3>
                                    <p className="section-description">Review your shipment details</p>
                                  </div>
                                </div>
                                <p>Step 4 content will be implemented here...</p>
                              </div>
                            </div>
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
