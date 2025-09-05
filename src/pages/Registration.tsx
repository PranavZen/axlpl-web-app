// src/pages/Registration.tsx
import { Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import BigLogo from "../assets/images/axlplLogoImg.png";
import Input from "../components/ui/input/Input";
import Label from "../components/ui/label/Label";
import SingleSelect, { OptionType } from "../components/ui/select/SingleSelect";

import { fetchNatureOfBusiness } from "../redux/slices/natureOfBusinessSlice";
import { fetchRegisterCategories } from "../redux/slices/registerCategorySlice";
import type { AppDispatch, RootState } from "../redux/store";
import {
  fetchRegisterAreasByPincode,
  fetchRegisterPincodeDetail,
} from "../redux/slices/registerPincodeSlice";

// ---- Validation ----
const RegistrationSchema = Yup.object().shape({
  companyName: Yup.string().trim().required("Company name is required"),
  fName: Yup.string().trim().required("Full name is required"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^\d{10}$/, "Mobile number must be 10 digits"),
  registerCategory: Yup.object({ value: Yup.string(), label: Yup.string() })
    .nullable()
    .required("Please select a category"),
  natureOfBusiness: Yup.object({ value: Yup.string(), label: Yup.string() })
    .nullable()
    .required("Please select nature of business"),
  addressLine1: Yup.string().trim().required("Address Line 1 is required"),
  addressLine2: Yup.string().trim(),
  pinCode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be 6 digits"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  area: Yup.object({ value: Yup.string(), label: Yup.string() })
    .nullable()
    .required("Please select area"),
});

type FormValues = {
  companyName: string;
  fName: string;
  mobile: string;
  registerCategory: OptionType | null;
  natureOfBusiness: OptionType | null;
  addressLine1: string;
  addressLine2: string;

  pinCode: string;
  state: string;
  city: string;
  area: OptionType | null;

  // keep IDs (not required, but useful on submit)
  stateId?: string;
  cityId?: string;
  countryId?: string;
};

const Registration: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // existing selects
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((s: RootState) => s.registerCategory);
  const {
    items: nobItems,
    loading: nobLoading,
    error: nobError,
  } = useSelector((s: RootState) => s.natureOfBusiness);

  const {
    detailLoading,
    detailError,
    areas,
    areasLoading,
    areasError,
  } = useSelector((s: RootState) => s.registerPincode);

  useEffect(() => {
    dispatch(fetchRegisterCategories());
    dispatch(fetchNatureOfBusiness());
  }, [dispatch]);

  // Map API -> react-select options
  const categoryOpts: OptionType[] = (categories ?? []).map((c) => ({
    label: c.name,
    value: c.value,
  }));
  const natureOpts: OptionType[] = (nobItems ?? []).map((n) => ({
    label: n.name,
    value: n.value,
  }));
  const areaOpts: OptionType[] = (areas ?? [])
    .filter((a) => (a.name ?? "").trim() !== "")
    .map((a) => ({ label: a.name, value: a.id }));

  const initialValues: FormValues = {
    companyName: "",
    fName: "",
    mobile: "",
    registerCategory: null,
    natureOfBusiness: null,
    addressLine1: "",
    addressLine2: "",
    pinCode: "",
    state: "",
    city: "",
    area: null,
    stateId: "",
    cityId: "",
    countryId: "",
  };

  const handleSubmit = (values: FormValues) => {
    // On submit, you'll have:
    // values.stateId, values.cityId, values.countryId
    // values.area?.value (ID) and label (name)
    // You can map/POST as your backend expects.
    console.log("Form submit:", values);
  };

  return (
    <section id="p_newLoginFormSection">
      <div className="container-fluid px-0">
        <div className="p_newFormRow">
          <div className="col-lg-8 col-md-8 col-12 p_newLeftSide px-0">
            <div className="p_loginInnerFormWrap">
              <div className="logoWrap d-flex justify-content-center mb-5">
                <img
                  src={BigLogo}
                  alt="axlpl"
                  width={300}
                  height={100}
                  className="img-fluid"
                />
              </div>

              <h1 className="p_formTitle">Create an account</h1>

              <Formik
                initialValues={initialValues}
                validationSchema={RegistrationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  setFieldValue,
                  handleSubmit,
                }) => {
                  const handlePinBlur = async (
                    e: React.FocusEvent<HTMLInputElement>
                  ) => {
                    handleBlur(e);
                    const pin = e.target.value.trim();

                    // only trigger when valid 6-digit pin
                    if (!/^\d{6}$/.test(pin)) {
                      // reset auto fields if pin invalid
                      setFieldValue("state", "");
                      setFieldValue("city", "");
                      setFieldValue("area", null);
                      setFieldValue("stateId", "");
                      setFieldValue("cityId", "");
                      setFieldValue("countryId", "");
                      return;
                    }

                    try {
                      // 1) detail → set state/city (+ ids)
                      const d = await dispatch(
                        fetchRegisterPincodeDetail(pin)
                      ).unwrap();
                      setFieldValue("state", d.state_name);
                      setFieldValue("city", d.city_name);
                      setFieldValue("stateId", d.state_id);
                      setFieldValue("cityId", d.city_id);
                      setFieldValue("countryId", d.country_id);

                      // 2) areas → populate select and auto match if area_id exists
                      const list = await dispatch(
                        fetchRegisterAreasByPincode(pin)
                      ).unwrap();
                      const match = list.find(
                        (a: { id: any; name: any }) =>
                          a.id === d.area_id && (a.name ?? "").trim() !== ""
                      );
                      if (match) {
                        setFieldValue("area", {
                          value: match.id,
                          label: match.name,
                        });
                      } else {
                        setFieldValue("area", null);
                      }
                    } catch (err) {
                      // if API fails, clear auto fields
                      setFieldValue("state", "");
                      setFieldValue("city", "");
                      setFieldValue("area", null);
                      setFieldValue("stateId", "");
                      setFieldValue("cityId", "");
                      setFieldValue("countryId", "");
                    }
                  };

                  return (
                    <form className="p_loginMainForm" onSubmit={handleSubmit}>
                      <div className="row">
                        {/* Company Name */}
                        <div className="form-floating col-6 mb-5">
                          <Input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={values.companyName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.companyName && errors.companyName
                                ? String(errors.companyName)
                                : undefined
                            }
                            touched={!!touched.companyName}
                            placeHolder="Enter Company Name"
                            className="form-control"
                          />
                          <Label
                            className="form-label"
                            htmlFor="companyName"
                            text="Company Name"
                          />
                          {touched.companyName && errors.companyName && (
                            <div className="errorText">
                              {String(errors.companyName)}
                            </div>
                          )}
                        </div>

                        {/* Full Name */}
                        <div className="form-floating col-6 mb-5">
                          <Input
                            type="text"
                            id="fName"
                            name="fName"
                            value={values.fName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.fName && errors.fName
                                ? String(errors.fName)
                                : undefined
                            }
                            touched={!!touched.fName}
                            placeHolder="Enter Full Name"
                            className="form-control"
                          />
                          <Label
                            className="form-label"
                            htmlFor="fName"
                            text="Full Name"
                          />
                          {touched.fName && errors.fName && (
                            <div className="errorText">
                              {String(errors.fName)}
                            </div>
                          )}
                        </div>

                       

                        {/* Register Category */}
                        <div className="form-floating col-6 mb-5 newLabel">
                          <SingleSelect
                            options={categoryOpts}
                            value={values.registerCategory}
                            onChange={(option) =>
                              setFieldValue("registerCategory", option)
                            }
                            placeholder={
                              categoriesLoading
                                ? "Loading categories..."
                                : "Select category"
                            }
                            isLoading={categoriesLoading}
                           id="registerCategorySelectOpt"
                            hasError={
                              !!touched.registerCategory &&
                              !!errors.registerCategory
                            }
                          />
                          <Label
                            className="form-label"
                            htmlFor="registerCategory"
                            text="Select Category"
                          />
                          {touched.registerCategory &&
                            errors.registerCategory && (
                              <div className="errorText">
                                {typeof errors.registerCategory === "string"
                                  ? errors.registerCategory
                                  : "Please select a category"}
                              </div>
                            )}
                          {categoriesError && (
                            <div className="errorText mt-1">
                              Failed to load categories: {categoriesError}
                            </div>
                          )}
                        </div>

                        {/* Nature of Business */}
                        <div className="form-floating col-6 mb-5 newLabel">
                          <SingleSelect
                            options={natureOpts}
                            value={values.natureOfBusiness}
                            onChange={(option) =>
                              setFieldValue("natureOfBusiness", option)
                            }
                            placeholder={
                              nobLoading
                                ? "Loading nature of business..."
                                : "Select nature of business"
                            }
                            isLoading={nobLoading}
                            id="registerCategorySelectOpt"
                            hasError={
                              !!touched.natureOfBusiness &&
                              !!errors.natureOfBusiness
                            }
                          />
                          <Label
                            className="form-label"
                            htmlFor="natureOfBusiness"
                            text="Select Nature of Business"
                          />
                          {touched.natureOfBusiness &&
                            errors.natureOfBusiness && (
                              <div className="errorText">
                                {typeof errors.natureOfBusiness === "string"
                                  ? errors.natureOfBusiness
                                  : "Please select nature of business"}
                              </div>
                            )}
                          {nobError && (
                            <div className="errorText mt-1">
                              Failed to load nature of business: {nobError}
                            </div>
                          )}
                        </div>

                        {/* Pincode */}
                        <div className="form-floating col-6 mb-5">
                          <Input
                            type="text"
                            id="pinCode"
                            name="pinCode"
                            value={values.pinCode}
                            onChange={handleChange}
                            onBlur={handlePinBlur}
                            error={
                              touched.pinCode && errors.pinCode
                                ? String(errors.pinCode)
                                : undefined
                            }
                            touched={!!touched.pinCode}
                            placeHolder="Enter 6-digit pincode"
                            className="form-control"
                            maxLength={6}
                          />
                          <Label
                            className="form-label"
                            htmlFor="pinCode"
                            text="Pincode"
                          />
                          {touched.pinCode && errors.pinCode && (
                            <div className="errorText">
                              {String(errors.pinCode)}
                            </div>
                          )}
                          {(detailLoading || areasLoading) && (
                            <div className="small text-muted mt-1">
                              Fetching location…
                            </div>
                          )}
                          {(detailError || areasError) && (
                            <div className="errorText mt-1">
                              {detailError || areasError}
                            </div>
                          )}
                        </div>

                        {/* State (read-only) */}
                        <div className="form-floating col-6 mb-5">
                          <Input
                            type="text"
                            id="state"
                            name="state"
                            value={values.state}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.state && errors.state
                                ? String(errors.state)
                                : undefined
                            }
                            touched={!!touched.state}
                            placeHolder="State"
                            className="form-control"
                            readOnly
                          />
                          <Label
                            className="form-label"
                            htmlFor="state"
                            text="State"
                          />
                          {touched.state && errors.state && (
                            <div className="errorText">
                              {String(errors.state)}
                            </div>
                          )}
                        </div>

                        {/* Area (value = id, label = name) */}
                        <div className="form-floating col-6 mb-5 newLabel">
                          <SingleSelect
                            options={areaOpts}
                            value={values.area}
                            onChange={(option) => setFieldValue("area", option)}
                            placeholder={
                              areasLoading ? "Loading areas..." : "Select area"
                            }
                            isLoading={areasLoading}
                            id="registerCategorySelectOpt"
                            hasError={!!touched.area && !!errors.area}
                          />
                          <Label
                            className="form-label"
                            htmlFor="area"
                            text="Select Area"
                          />
                          {touched.area && errors.area && (
                            <div className="errorText">
                              {typeof errors.area === "string"
                                ? errors.area
                                : "Please select area"}
                            </div>
                          )}
                          {areasError && (
                            <div className="errorText mt-1">
                              Failed to load areas: {areasError}
                            </div>
                          )}
                        </div>

                        {/* City (read-only) */}
                        <div className="form-floating col-6 mb-5">
                          <Input
                            type="text"
                            id="city"
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.city && errors.city
                                ? String(errors.city)
                                : undefined
                            }
                            touched={!!touched.city}
                            placeHolder="City"
                            className="form-control"
                            readOnly
                          />
                          <Label
                            className="form-label"
                            htmlFor="city"
                            text="City"
                          />
                          {touched.city && errors.city && (
                            <div className="errorText">
                              {String(errors.city)}
                            </div>
                          )}
                        </div>

                        {/* Address Line 1 */}
                        <div className="form-floating col-6 mb-5">
                          <Input
                            type="text"
                            id="addressLine1"
                            name="addressLine1"
                            value={values.addressLine1}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.addressLine1 && errors.addressLine1
                                ? String(errors.addressLine1)
                                : undefined
                            }
                            touched={!!touched.addressLine1}
                            placeHolder="Enter Address Line 1"
                            className="form-control"
                          />
                          <Label
                            className="form-label"
                            htmlFor="addressLine1"
                            text="Address Line 1"
                          />
                          {touched.addressLine1 && errors.addressLine1 && (
                            <div className="errorText">
                              {String(errors.addressLine1)}
                            </div>
                          )}
                        </div>

                        {/* Address Line 2 */}
                        <div className="form-floating col-6 mb-5">
                          <Input
                            type="text"
                            id="addressLine2"
                            name="addressLine2"
                            value={values.addressLine2}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.addressLine2 && errors.addressLine2
                                ? String(errors.addressLine2)
                                : undefined
                            }
                            touched={!!touched.addressLine2}
                            placeHolder="Enter Address Line 2"
                            className="form-control"
                          />
                          <Label
                            className="form-label"
                            htmlFor="addressLine2"
                            text="Address Line 2"
                          />
                          {touched.addressLine2 && errors.addressLine2 && (
                            <div className="errorText">
                              {String(errors.addressLine2)}
                            </div>
                          )}
                        </div>

                        {/* Hidden ID fields (submit to backend if needed) */}
                        <input
                          type="hidden"
                          name="stateId"
                          value={values.stateId}
                        />
                        <input
                          type="hidden"
                          name="cityId"
                          value={values.cityId}
                        />
                        <input
                          type="hidden"
                          name="countryId"
                          value={values.countryId}
                        />
                      </div>

                       {/* Mobile */}
                       <div className="form-floating col-6 mb-5">
                          <Input
                            type="text"
                            id="mobile"
                            name="mobile"
                            value={values.mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.mobile && errors.mobile
                                ? String(errors.mobile)
                                : undefined
                            }
                            touched={!!touched.mobile}
                            placeHolder="Enter mobile number"
                            className="form-control"
                            maxLength={10}
                          />
                          <Label
                            className="form-label"
                            htmlFor="mobile"
                            text="Mobile Number"
                          />
                          {touched.mobile && errors.mobile && (
                            <div className="errorText">
                              {String(errors.mobile)}
                            </div>
                          )}
                        </div>

                      <button type="submit" className="btn btn-primary w-100">
                        Submit
                      </button>
                    </form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
