// ===================================================================
// GLOBAL TYPE DEFINITIONS
// ===================================================================

// User and Authentication Types
export interface User {
  id: string;
  role: string;
  token: string;
  Customerdetail?: CustomerDetail;
}

export interface CustomerDetail {
  id: string;
  role: string;
  token: string;
  full_name?: string;
  company_name?: string;
  email?: string;
  mobile?: string;
  cust_profile_img?: string;
  path?: string;
}



// Shipment Types
export interface Shipment {
  id: string;
  shipment_id: string;
  sender_name: string;
  receiver_name: string;
  origin: string;
  destination: string;
  shipment_status: string;
  created_date: string;
  sender_company_name?: string;
  receiver_company_name?: string;
  sender_areaname?: string;
  receiver_areaname?: string;
  sender_gst_no?: string;
  receiver_gst_no?: string;
}

// Address Types
export interface Address {
  id: string;
  address_type: string;
  company_name: string;
  contact_person: string;
  mobile: string;
  email: string;
  address: string;
  pincode: string;
  state_id: string;
  city_id: string;
  area_id: string;
  state_name?: string;
  city_name?: string;
  area_name?: string;
  gst_no?: string;
}

// Location Types
export interface State {
  id: string;
  state_name: string;
}

export interface City {
  id: string;
  city_name: string;
  state_id: string;
}

export interface Area {
  id: string;
  area_name: string;
  city_id: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'password' | 'select' | 'textarea' | 'file' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: ValidationRule[];
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  status: 'success' | 'fail' | 'error';
  message: string;
  data?: T;
}

// Redux State Types
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Table Types
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableAction {
  label: string;
  icon?: string;
  onClick: (row: any) => void;
  className?: string;
  disabled?: (row: any) => boolean;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Export Types
export type ExportFormat = 'csv' | 'excel' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  selectedRows?: any[];
  columns?: string[];
}

// Pagination Types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any;
}

// Tracking Types
export interface TrackingStatus {
  status: string;
  date_time: string;
}

export interface SenderData {
  sender_name: string;
  company_name: string;
  mobile: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  area: string;
  pincode: string;
}

export interface ReceiverData {
  receiver_name: string;
  company_name: string;
  mobile: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  area: string;
  pincode: string;
}

export interface ShipmentDetails {
  shipment_id: string;
  cust_id: string;
  parcel_detail: string;
  category_id: string;
  net_weight: string;
  gross_weight: string;
  payment_mode: string;
  service_id: string;
  invoice_value: string;
  axlpl_insurance: string;
  policy_no: string;
  exp_date: string;
  insurance_value: string;
  remark: string;
  bill_to: string;
  number_of_parcel: string;
  additional_axlpl_insurance: string;
  shipment_charges: string;
  insurance_charges: string;
  invoice_charges: string;
  handling_charges: string;
  tax: string;
  total_charges: string;
}

export interface TrackingData {
  TrackingStatus: TrackingStatus[];
  SenderData?: SenderData;
  ReceiverData?: ReceiverData;
  ShipmentDetails?: ShipmentDetails;
}

export interface TrackingResponse {
  tracking: TrackingData[];
  error: boolean;
  code: number;
  type: string;
  message: string;
}

export interface TrackingState {
  trackingData: TrackingData | null;
  loading: boolean;
  error: string | null;
  searchedShipmentId: string | null;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface ButtonProps extends BaseComponentProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text?: string;
}

// Route Types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  protected?: boolean;
  exact?: boolean;
}
