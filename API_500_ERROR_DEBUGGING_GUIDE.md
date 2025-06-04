# API 500 Error Debugging Guide

## Current Status ✅
- ✅ Form submission is working
- ✅ API call is being made to `insertShipment` endpoint
- ❌ Getting 500 Internal Server Error from API

## Next Steps for Debugging

### 1. **Test the Form Submission**
1. Open the application (running on new port)
2. Navigate to Add Shipment page
3. Fill out the multi-step form:
   - **Step 1**: Fill basic shipment details
   - **Step 2**: Fill sender/receiver info
   - **Step 3**: Fill delivery options
   - **Step 4**: Select pickup date and review charges
4. Click "Submit Shipment" button

### 2. **Check Console Logs**
When you submit, you should see detailed logs like:
```
📝 Formik onSubmit called - Step: 3
✅ Last step reached, calling handleSubmit
🚀 handleSubmit called with values: {...}
📤 Dispatching submitShipment...
🔄 submitShipment thunk called with: {...}
🔐 Auth check - Token: true UserId: [user_id]
📋 FormData prepared, making API call to: https://new.axlpl.com/messenger/services_v6/insertShipment
📊 Complete FormData contents:
  customer_id: 63
  category_id: 1
  product_id: 2
  net_weight: 0
  gross_weight: 0
  ... (all form fields)
💥 API Error: [error details]
💥 Error Response: [server response]
💥 Error Status: 500
```

### 3. **Analyze the Form Data**
Look for these potential issues in the console logs:

#### **Missing Required Fields**
Check if any of these are empty or null:
- `customer_id`
- `category_id`
- `product_id`
- `sender_company_name`
- `receiver_company_name`
- `gross_weight`
- `invoice_value`

#### **Invalid Data Types**
Check if numeric fields contain valid numbers:
- `net_weight`, `gross_weight`
- `invoice_value`, `insurance_value`
- `shipment_charges`, `total_charges`

#### **Invalid Date Format**
Check if dates are in correct format (YYYY-MM-DD):
- `shipment_date`
- `exp_date` (if insurance is selected)

### 4. **Common 500 Error Causes**

#### **Issue 1: Missing Authentication**
**Check**: Look for "Authentication required" error
**Solution**: Ensure user is logged in with valid token

#### **Issue 2: Invalid Customer/Product IDs**
**Check**: Verify `customer_id`, `category_id`, `product_id` exist in database
**Solution**: Use valid IDs from your system

#### **Issue 3: Invalid State/City/Area IDs**
**Check**: Verify location IDs are valid
**Solution**: Use actual IDs from your location APIs

#### **Issue 4: Missing Required Address Fields**
**Check**: Ensure all address fields are filled
**Solution**: Add validation for required fields

#### **Issue 5: Invalid Numeric Values**
**Check**: Ensure weights and charges are valid numbers
**Solution**: Add number validation and formatting

### 5. **Debugging Steps**

#### **Step 1: Check Network Tab**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Submit the form
4. Look for the POST request to `insertShipment`
5. Check the request payload and response

#### **Step 2: Check Server Response**
Look for specific error messages in the response:
```json
{
  "status": "error",
  "message": "Specific error description",
  "errors": {
    "field_name": "Field specific error"
  }
}
```

#### **Step 3: Validate Form Data**
Copy the form data from console logs and verify:
- All required fields are present
- Data types are correct
- IDs reference existing records
- Dates are in correct format

### 6. **Quick Fixes to Try**

#### **Fix 1: Use Valid Test Data**
I've added default values that match your example:
- `customer_id`: "63"
- `sender_customer_id`: "233"
- `receiver_customer_id`: "1950"
- Default addresses and contact info

#### **Fix 2: Ensure Required Fields**
Make sure these are not empty:
```javascript
// Required fields that often cause 500 errors
customer_id: "63"
category_id: "1"
product_id: "2"
gross_weight: "546"
invoice_value: "10000"
sender_company_name: "A.B. GOLD"
receiver_company_name: "DGLA QUALITY SERVICS PVT. LTD."
```

#### **Fix 3: Check Date Format**
Ensure dates are in YYYY-MM-DD format:
```javascript
shipment_date: "2025-05-14"
exp_date: "2025-12-31" (if insurance selected)
```

### 7. **Testing Checklist**

- [ ] User is logged in with valid token
- [ ] All form steps are completed
- [ ] Required fields are filled
- [ ] Pickup date is selected in Step 4
- [ ] Console shows complete form data
- [ ] Network tab shows POST request
- [ ] Check exact error response from server

### 8. **Expected Working Data**

Based on your example, the API expects data like:
```
customer_id: 63
category_id: 1
product_id: 2
net_weight: 122
gross_weight: 546
invoice_value: 10000
sender_company_name: A.B. GOLD
receiver_company_name: DGLA QUALITY SERVICS PVT. LTD.
shipment_charges: 0
insurance_charges: 0.00
handling_charges: 0.00
tax: 147.42
total_charges: 819
grand_total: 966.42
```

### 9. **Next Actions**

1. **Test the form** and copy the exact console output
2. **Check the server error response** for specific error details
3. **Compare form data** with the working example you provided
4. **Identify missing or invalid fields** causing the 500 error
5. **Fix data mapping** based on server error response

The detailed logging will help identify exactly what's causing the 500 error. Once we see the exact error response and form data, we can fix the specific issue!
