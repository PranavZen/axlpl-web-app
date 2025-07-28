import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser as FaUserIconRaw } from 'react-icons/fa';
import Button from '../components/ui/button/Button';
import Input from '../components/ui/input/Input';
import Label from '../components/ui/label/Label';
import MainBody from '../components/ui/mainbody/MainBody';
import SingleSelect from '../components/ui/select/SingleSelect';
import Sidebar from '../components/ui/sidebar/Sidebar';
import { InlineLogisticsLoader, LogisticsLoader } from '../components/ui/spinner';
import SwitchButton from '../components/ui/switch/SwitchButton';

import {
  fetchProfileData,
  ProfileData,
  selectAreas,
  selectBranches,
  selectCities,
  selectCountries,
  selectProfileData,
  selectProfileError,
  selectProfileLoading,
  selectProfileSaving,
  selectStates,
  updateProfileData,
  updateProfileDataLocal
} from '../redux/slices/profileSlice';
import { AppDispatch, RootState } from '../redux/store';
import '../styles/global/AddShipment.scss';
import '../styles/pages/EditProfile.scss';
import { showError, showSuccess } from '../utils/toastUtils';

// Cast icon to JSX-compatible component
const FaUser = FaUserIconRaw as React.FC<React.SVGProps<SVGSVGElement>>;


const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get user data from Redux store
  const { user } = useSelector((state: RootState) => state.auth);

  // Get profile data from Redux store
  const profileData = useSelector(selectProfileData);
  const loading = useSelector(selectProfileLoading);
  const saving = useSelector(selectProfileSaving);
  const error = useSelector(selectProfileError);
  const countries = useSelector(selectCountries);
  const states = useSelector(selectStates);
  const cities = useSelector(selectCities);
  const areas = useSelector(selectAreas);
  const branches = useSelector(selectBranches);

  // File upload states (keeping local as they're temporary)
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [panCard, setPanCard] = useState<File | null>(null);
  const [gstCertificate, setGstCertificate] = useState<File | null>(null);
  const [regCertificate, setRegCertificate] = useState<File | null>(null);

  // Category and nature of business options
  const categoryOptions = [
    'Exporter',
    'Importer',
    'Manufacturer',
    'Trader',
    'Service Provider',
    'Retailer',
    'Wholesaler',
    'Distributor'
  ];

  const natureBusinessOptions = [
    'Manufacturing',
    'Trading',
    'Service',
    'Export',
    'Import',
    'Retail',
    'Wholesale',
    'Distribution',
    'Logistics',
    'Transportation',
    'Freight Forwarding',
    'Customs Clearance',
    'Warehousing',
    'E-commerce',
    'Textile',
    'Electronics',
    'Automotive',
    'Chemicals',
    'Pharmaceuticals',
    'Food & Beverages',
    'Agriculture',
    'Construction',
    'Real Estate',
    'IT Services',
    'Consulting',
    'Other'
  ];

  // Fetch profile data using Redux
  const fetchProfileDataFromRedux = useCallback(async () => {
    if (!user?.Customerdetail?.id) {
      showError('❌ User data not found. Please login again.');
      navigate('/');
      return;
    }

    dispatch(fetchProfileData());
  }, [user, navigate, dispatch]);

  // Check user authentication and fetch profile data on component mount
  useEffect(() => {
    if (!user?.Customerdetail?.id) {
      showError('❌ User not authenticated. Please login again.');
      navigate('/');
      return;
    }

    fetchProfileDataFromRedux();
  }, [user, fetchProfileDataFromRedux, navigate]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    if (profileData) {
      dispatch(updateProfileDataLocal({
        [field]: value
      }));
    }
  };

  const handleFileChange = (type: string, file: File | null) => {
    switch (type) {
      case 'profile':
        setProfileImage(file);
        break;
      case 'pan':
        setPanCard(file);
        break;
      case 'gst':
        setGstCertificate(file);
        break;
      case 'reg':
        setRegCertificate(file);
        break;
    }
  };

  const handleSave = async () => {
    if (!profileData) {
      showError('❌ No profile data to save');
      return;
    }

    if (!user?.Customerdetail?.id) {
      showError('❌ User not authenticated. Please login again.');
      return;
    }

    // Validate required fields - only full_name is editable
    if (!profileData.full_name || profileData.full_name.trim() === '') {
      showError('❌ Please fill in the Full Name field');
      return;
    }

    try {
      const files = {
        profileImage,
        panCard,
        gstCertificate,
        regCertificate
      };

      const result = await dispatch(updateProfileData({ profileData, files }));

      if (updateProfileData.fulfilled.match(result)) {
        const successMessage = result.payload.message || '✅ Profile updated successfully!';
        showSuccess(successMessage);

        // Clear file selections after successful update
        setProfileImage(null);
        setPanCard(null);
        setGstCertificate(null);
        setRegCertificate(null);

        // Add a small delay to ensure server has processed the update
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Refresh the profile data to get the latest from server
        dispatch(fetchProfileData());
      } else if (updateProfileData.rejected.match(result)) {
        const errorMessage = result.payload as string || 'Failed to update profile';
        showError(`❌ ${errorMessage}`);
      } else {
        showError('❌ Unknown error occurred. Please try again.');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update profile. Please try again.';
      showError(`❌ ${errorMessage}`);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };



  if (loading) {
    return <LogisticsLoader />;
  }

  if (error || !profileData) {
    return (
      <div className="d-flex">
        <Sidebar />
        <MainBody>
          <div className="alert alert-danger">
            <h4>Error Loading Profile</h4>
            <p>{error || 'Unable to load profile data. Please try again.'}</p>
            <Button
              text="Retry"
              onClick={() => fetchProfileDataFromRedux()}
              className="btn btn-next"
            />
          </div>
        </MainBody>
      </div>
    );
  }

  return (
    <div className="d-flex bodyWrap">
      <Sidebar />
      <MainBody>
        <div className="edit-profile-container">
          <div className="profile-form">
            {/* Profile Image Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-user-circle me-2"></i>
                  Profile Image
                </h5>
              </div>
              <div className="card-body text-center">
                <div className="profile-image-container mb-3">
                  {profileData.cust_profile_img && 
                   profileData.cust_profile_img !== "0" && 
                   profileData.cust_profile_img !== 0 ? (
                    <img
                      src={`${profileData.path}${profileData.cust_profile_img}`}
                      alt="Profile"
                      className="profile-image"
                    />
                  ) : (
                    <div className="default-avatar-icon-large">
                      <FaUser />
                    </div>
                  )}
                </div>
                <div className="file-upload-section">
                  <input
                    type="file"
                    id="profileImageInput"
                    accept="image/*"
                    onChange={(e) => handleFileChange('profile', e.target.files?.[0] || null)}
                    className="d-none"
                    disabled={true}
                  />
                  <label
                    htmlFor="profileImageInput"
                    className="btn btn-outline-secondary btn-back camera-btn disabled"
                    title="Profile Picture Upload Disabled"
                    style={{ pointerEvents: 'none', opacity: 0.6 }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="camera-icon"
                    >
                      <path
                        d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="13"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </label>
                  {profileImage && (
                    <div className="mt-2">
                      <small className="text-success" style={{fontSize: '1.3rem'}}>
                        <i className="fas fa-check-circle me-1"></i>
                        New image selected: {profileImage.name}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Company Information Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-building me-2"></i>
                  Company Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="company_name"
                      text="Company Name *"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="text"
                      id="company_name"
                      name="company_name"
                      value={profileData.company_name || ''}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      onBlur={() => {}}
                      placeHolder="Enter company name"
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="full_name"
                      text="Full Name *"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={profileData.full_name || ''}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      onBlur={() => {}}
                      placeHolder="Enter full name"
                      className="form-control innerFormControll"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="category"
                      text="Category *"
                      className="form-label innerLabel"
                    />
                    <SingleSelect
                      id="category"
                      options={categoryOptions.map(option => ({ value: option, label: option }))}
                      value={profileData.category ? { value: profileData.category, label: profileData.category } : null}
                      onChange={(selected) => handleInputChange('category', selected?.value || '')}
                      placeholder="Select Category"
                      isDisabled={true}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="nature_business"
                      text="Nature of Business *"
                      className="form-label innerLabel"
                    />
                    <SingleSelect
                      id="nature_business"
                      options={natureBusinessOptions.map(option => ({ value: option, label: option }))}
                      value={profileData.nature_business ? { value: profileData.nature_business, label: profileData.nature_business } : null}
                      onChange={(selected) => handleInputChange('nature_business', selected?.value || '')}
                      placeholder="Select Nature of Business"
                      isDisabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Location Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="country_id"
                      text="Country *"
                      className="form-label innerLabel"
                    />
                    <SingleSelect
                      id="country_id"
                      options={countries.map((country: any) => ({ value: country.id, label: country.name }))}
                      value={profileData.country_id ? countries.find((c: any) => c.id === profileData.country_id) ? { value: profileData.country_id, label: countries.find((c: any) => c.id === profileData.country_id)?.name || '' } : null : null}
                      onChange={(selected) => handleInputChange('country_id', selected?.value || '')}
                      placeholder="Select Country"
                      isDisabled={true}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="state_id"
                      text="State *"
                      className="form-label innerLabel"
                    />
                    <SingleSelect
                      id="state_id"
                      options={states.map((state: any) => ({ value: state.id, label: state.name }))}
                      value={profileData.state_id ? states.find((s: any) => s.id === profileData.state_id) ? { value: profileData.state_id, label: states.find((s: any) => s.id === profileData.state_id)?.name || '' } : null : null}
                      onChange={(selected) => handleInputChange('state_id', selected?.value || '')}
                      placeholder="Select State"
                      isDisabled={true}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="city_id"
                      text="City *"
                      className="form-label innerLabel"
                    />
                    <SingleSelect
                      id="city_id"
                      options={cities.map((city: any) => ({ value: city.id, label: city.name }))}
                      value={profileData.city_id ? cities.find((c: any) => c.id === profileData.city_id) ? { value: profileData.city_id, label: cities.find((c: any) => c.id === profileData.city_id)?.name || '' } : null : null}
                      onChange={(selected) => handleInputChange('city_id', selected?.value || '')}
                      placeholder="Select City"
                      isDisabled={true}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="area_id"
                      text="Area *"
                      className="form-label innerLabel"
                    />
                    <SingleSelect
                      id="area_id"
                      options={areas.map((area: any) => ({ value: area.id, label: area.name }))}
                      value={profileData.area_id ? areas.find((a: any) => a.id === profileData.area_id) ? { value: profileData.area_id, label: areas.find((a: any) => a.id === profileData.area_id)?.name || '' } : null : null}
                      onChange={(selected) => handleInputChange('area_id', selected?.value || '')}
                      placeholder="Select Area"
                      isDisabled={true}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="branch_id"
                      text="Branch"
                      className="form-label innerLabel"
                    />
                    <SingleSelect
                      id="branch_id"
                      options={branches.map((branch: any) => ({ value: branch.id, label: branch.name }))}
                      value={profileData.branch_id ? branches.find((b: any) => b.id === profileData.branch_id) ? { value: profileData.branch_id, label: branches.find((b: any) => b.id === profileData.branch_id)?.name || '' } : null : null}
                      onChange={(selected) => handleInputChange('branch_id', selected?.value || '')}
                      placeholder="Select Branch"
                      isDisabled={true}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="pincode"
                      text="Pincode *"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={profileData.pincode || ''}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      onBlur={() => {}}
                      placeHolder="Enter pincode"
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="reg_address1"
                      text="Registered Address *"
                      className="form-label innerLabel"
                    />
                    <textarea
                      id="reg_address1"
                      name="reg_address1"
                      className="form-control innerFormControll"
                      rows={3}
                      value={profileData.reg_address1 || ''}
                      onChange={(e) => handleInputChange('reg_address1', e.target.value)}
                      placeholder="Enter registered address"
                      required
                      disabled={true}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="reg_address2"
                      text="Additional Address"
                      className="form-label innerLabel"
                    />
                    <textarea
                      id="reg_address2"
                      name="reg_address2"
                      className="form-control innerFormControll"
                      rows={3}
                      value={profileData.reg_address2 || ''}
                      onChange={(e) => handleInputChange('reg_address2', e.target.value)}
                      placeholder="Enter additional address (optional)"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-phone me-2"></i>
                  Contact Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="mobile_no"
                      text="Mobile Number *"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="tel"
                      id="mobile_no"
                      name="mobile_no"
                      value={profileData.mobile_no || ''}
                      onChange={(e) => handleInputChange('mobile_no', e.target.value)}
                      onBlur={() => {}}
                      placeHolder="Enter mobile number"
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="tel_no"
                      text="Telephone Number"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="tel"
                      id="tel_no"
                      name="tel_no"
                      value={profileData.tel_no || ''}
                      onChange={(e) => handleInputChange('tel_no', e.target.value)}
                      onBlur={() => {}}
                      placeHolder="Enter telephone number"
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="fax_no"
                      text="Fax Number"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="tel"
                      id="fax_no"
                      name="fax_no"
                      value={profileData.fax_no || ''}
                      onChange={(e) => handleInputChange('fax_no', e.target.value)}
                      onBlur={() => {}}
                      placeHolder="Enter fax number"
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="email"
                      text="Email Address *"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => {}}
                      placeHolder="Enter email address"
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Documents Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-file-alt me-2"></i>
                  Legal Documents
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="pan_no"
                      text="PAN Number *"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="text"
                      id="pan_no"
                      name="pan_no"
                      value={profileData.pan_no || ''}
                      onChange={(e) => handleInputChange('pan_no', e.target.value)}
                      onBlur={() => {}}
                      placeHolder="Enter PAN number"
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="gst_no"
                      text="GST Number"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="text"
                      id="gst_no"
                      name="gst_no"
                      value={profileData.gst_no || ''}
                      onChange={(e) => handleInputChange('gst_no', e.target.value)}
                      onBlur={() => {}}
                      placeHolder="Enter GST number"
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Label
                      htmlFor="panCardInput"
                      text="PAN Card Upload"
                      className="form-label innerLabel"
                    />
                    <input
                      type="file"
                      id="panCardInput"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('pan', e.target.files?.[0] || null)}
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                    {profileData?.pan_card && (
                      <div className="current-file mt-2">
                        <small className="text-success" style={{fontSize: '1.3rem'}}>
                          <i className="fas fa-file-check me-1"></i>
                          Current: {profileData.pan_card}
                        </small>
                      </div>
                    )}
                    {panCard && (
                      <div className="mt-2">
                        <small className="text-success" style={{fontSize: '1.3rem'}}>
                          <i className="fas fa-check-circle me-1"></i>
                          New file selected: {panCard.name}
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <Label
                      htmlFor="gstCertificateInput"
                      text="GST Certificate Upload"
                      className="form-label innerLabel"
                    />
                    <input
                      type="file"
                      id="gstCertificateInput"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('gst', e.target.files?.[0] || null)}
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                    {profileData?.gst_certi && (
                      <div className="current-file mt-2">
                        <small className="text-success" style={{fontSize: '1.3rem'}}>
                          <i className="fas fa-file-check me-1"></i>
                          Current: {profileData.gst_certi}
                        </small>
                      </div>
                    )}
                    {gstCertificate && (
                      <div className="mt-2">
                        <small className="text-success" style={{fontSize: '1.3rem'}}>
                          <i className="fas fa-check-circle me-1"></i>
                          New file selected: {gstCertificate.name}
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <Label
                      htmlFor="regCertificateInput"
                      text="Registration Certificate Upload"
                      className="form-label innerLabel"
                    />
                    <input
                      type="file"
                      id="regCertificateInput"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('reg', e.target.files?.[0] || null)}
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                    {profileData?.reg_certi && (
                      <div className="current-file mt-2">
                        <small className="text-success" style={{fontSize: '1.3rem'}}>
                          <i className="fas fa-file-check me-1"></i>
                          Current: {profileData.reg_certi}
                        </small>
                      </div>
                    )}
                    {regCertificate && (
                      <div className="mt-2">
                        <small className="text-success" style={{fontSize: '1.3rem'}}>
                          <i className="fas fa-check-circle me-1"></i>
                          New file selected: {regCertificate.name}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance Information Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-shield-alt me-2"></i>
                  Insurance Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="axlpl_insurance_value"
                      text="AXLPL Insurance Value"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="number"
                      id="axlpl_insurance_value"
                      name="axlpl_insurance_value"
                      value={profileData.axlpl_insurance_value || ''}
                      onChange={(e) => handleInputChange('axlpl_insurance_value', e.target.value)}
                      onBlur={() => {}}
                      placeHolder="Enter insurance value"
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="third_party_insurance_value"
                      text="Third Party Insurance Value"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="number"
                      id="third_party_insurance_value"
                      name="third_party_insurance_value"
                      value={profileData.third_party_insurance_value || ''}
                      onChange={(e) => handleInputChange('third_party_insurance_value', e.target.value)}
                      onBlur={() => {}}
                      placeHolder="Enter third party insurance value"
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="third_party_policy_no"
                      text="Third Party Policy Number"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="text"
                      id="third_party_policy_no"
                      name="third_party_policy_no"
                      value={profileData.third_party_policy_no || ''}
                      onChange={(e) => handleInputChange('third_party_policy_no', e.target.value)}
                      onBlur={() => {}}
                      placeHolder="Enter policy number"
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Label
                      htmlFor="third_party_exp_date"
                      text="Third Party Expiry Date"
                      className="form-label innerLabel"
                    />
                    <Input
                      type="date"
                      id="third_party_exp_date"
                      name="third_party_exp_date"
                      value={profileData.third_party_exp_date || ''}
                      onChange={(e) => handleInputChange('third_party_exp_date', e.target.value)}
                      onBlur={() => {}}
                      placeHolder=""
                      className="form-control innerFormControll"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-cog me-2"></i>
                  Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3 radioBtnWrap">
                    <Label
                      htmlFor="is_shipment_approve"
                      text="Shipment Approval Required"
                      className="form-label innerLabel"
                    />
                    <SwitchButton
                      id="is_shipment_approve"
                      name="is_shipment_approve"
                      label=""
                      checked={profileData.is_shipment_approve === '1'}
                      onChange={(e) => handleInputChange('is_shipment_approve', e.target.checked ? '1' : '0')}
                      disabled={true}
                    />
                  </div>

                  <div className="col-md-4 mb-3 radioBtnWrap">
                    <Label
                      htmlFor="is_send_mail"
                      text="Email Notifications"
                      className="form-label innerLabel"
                    />
                    <SwitchButton
                      id="is_send_mail"
                      name="is_send_mail"
                      label=""
                      checked={profileData.is_send_mail === '1'}
                      onChange={(e) => handleInputChange('is_send_mail', e.target.checked ? '1' : '0')}
                      disabled={true}
                    />
                  </div>

                  <div className="col-md-4 mb-3 radioBtnWrap">
                    <Label
                      htmlFor="is_send_sms"
                      text="SMS Notifications"
                      className="form-label innerLabel"
                    />
                    <SwitchButton
                      id="is_send_sms"
                      name="is_send_sms"
                      label=""
                      checked={profileData.is_send_sms === '1'}
                      onChange={(e) => handleInputChange('is_send_sms', e.target.checked ? '1' : '0')}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card">
              <div className="card-body">
                <div className="form-navigation border-top-0 ps-0">
                  <div className="navigation-buttons">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="btn btn-outline-secondary btn-back"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="btn btn-primary btn-next"
                    >
                      {saving ? (
                        <>
                          <span className="me-2">
                            <InlineLogisticsLoader size="sm" />
                          </span>
                          Saving...
                        </>
                      ) : (
                        <>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainBody>
    </div>
  );
};

export default EditProfile;
