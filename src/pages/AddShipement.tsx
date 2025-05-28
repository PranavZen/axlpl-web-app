import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import MainBody from "../components/ui/mainbody/MainBody";
import Sidebar from "../components/ui/sidebar/Sidebar";
import { RootState } from "../redux/store";
import { resetFormData, setFormData } from "../redux/slices/shipmentSlice";
import * as Yup from "yup";
import StepOneFormFields from "../components/pagecomponents/addshipmentpage/StepOneFormFields";
import FormNavigation from "../components/pagecomponents/addshipmentpage/FormNavigation";

const steps = ["Shipment Details", "Other Details"];

const AddShipment = () => {
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.shipment);

  const initialValues = {
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
    ...formData,
  };

  const validationSchema = [
    Yup.object({
      name: Yup.string().required("Customer Name is required"),
      category: Yup.array().min(1, "Select at least one category"),
      commodity: Yup.array().min(1, "Select at least one commodity"),
      netWeight: Yup.number().required(),
      grossWeight: Yup.number().required(),
      paymentMode: Yup.array().min(1),
      numberOfParcel: Yup.number().required(),
      serviceType: Yup.array().min(1),
      insurance: Yup.boolean(),
      expiryDate: Yup.date().required(),
      policyNumber: Yup.number().required(),
      insuranceValue: Yup.number().required(),
      invoiceValue: Yup.number().required(),
      remark: Yup.string().required(),
    }),
  ];

  const handleSubmit = (values: any) => {
    dispatch(resetFormData());
    // console.log("Submit to API", values);
  };

  return (
    <section className="d-flex flex-column flex-grow-1">
      <div className="container-fluid p-0">
        <section className="bodyWrap">
          <Sidebar />
          <MainBody>
            <div className="topBox">
              <h4>Complete Shipment Details</h4>
              <p>Lorem Ipsum is simply dummy text</p>
              <div className="stepsCountWrap">
                <div className="stepsCount">
                  <span className="stepCount">
                    {step + 1}/{steps.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="container-fluid px-5">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema[step]}
                onSubmit={(values) => {
                  dispatch(setFormData(values));
                  step === steps.length - 1
                    ? handleSubmit(values)
                    : setStep(step + 1);
                }}
                enableReinitialize
              >
                {({ values, setFieldValue }) => (
                  <Form className="row g-4 needs-validation" noValidate>
                    {step === 0 && (
                      <StepOneFormFields
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    )}
                    {step === 1 && <h2>Step 2</h2>}

                    <FormNavigation
                      step={step}
                      stepsLength={steps.length}
                      onBack={() => setStep(step - 1)}
                    />
                  </Form>
                )}
              </Formik>
            </div>
          </MainBody>
        </section>
      </div>
    </section>
  );
};

export default AddShipment;
