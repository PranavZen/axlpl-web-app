# Edit Shipment Data Loading Debug Guide

## 🐛 **Issue: No Data in Edit Shipment Form**

The edit shipment page is loading but the form fields are empty. This guide helps debug and fix the data loading issue.

## 🔍 **Debugging Steps**

### **Step 1: Check Browser Console**

Open the edit shipment page and check the browser console for these logs:

```
Shipment data received: {...}
Shipment fields: [array of field names]
Current form values: {...}
```

### **Step 2: Check Debug Panel**

In development mode, you'll see a debug panel showing:
- **Shipment ID**: The ID from the URL
- **Shipment Data Available**: Yes/No
- **Shipment Data**: Full JSON object (click to expand)
- **Initial Values Sample**: Key form fields

### **Step 3: Verify Data Flow**

1. **From Shipments Table**:
   - Click "Edit" button on a shipment
   - Check console: "Edit shipment:" should show the shipment object
   - Verify Redux store receives the data

2. **Direct URL Access**:
   - Navigate directly to `/edit-shipment/SHIPMENT_ID`
   - Check console for API call logs
   - Verify API response structure

## 🔧 **Common Issues & Fixes**

### **Issue 1: Field Name Mismatch**

**Problem**: Form fields are empty because API field names don't match form field names.

**Solution**: Updated field mapping to use actual API field names:

```typescript
// Fixed field mapping
const initialValues = {
  name: shipment?.sender_company_name || "", // Use actual API field
  senderCompanyName: shipment?.sender_company_name || "",
  receiverCompanyName: shipment?.receiver_company_name || "",
  senderArea: shipment?.sender_areaname || null, // Use sender_areaname
  receiverArea: shipment?.receiver_areaname || null, // Use receiver_areaname
  // ... other fields
};
```

### **Issue 2: Timing Issue**

**Problem**: Form initializes before shipment data is available.

**Solution**: Added `enableReinitialize={true}` to Formik and proper loading states.

### **Issue 3: Redux Store Not Updated**

**Problem**: Shipment data not passed to Redux store when clicking edit.

**Solution**: Enhanced edit handler to set data in store:

```typescript
const handleEditShipment = (shipment: any) => {
  // Set shipment data in Redux store
  dispatch(setShipment(shipment));
  
  // Navigate to edit page
  navigate(`/edit-shipment/${shipment.shipment_id}`);
};
```

## 🧪 **Testing Scenarios**

### **Scenario 1: Normal Edit Flow**
1. Go to Active Shipments: `http://localhost:3001/shipments/approved`
2. Click "Edit" on any shipment
3. **Expected**: Form should be pre-filled with shipment data
4. **Check**: Debug panel shows "Shipment Data Available: Yes"

### **Scenario 2: Direct URL Access**
1. Copy a shipment ID from the table
2. Navigate to: `http://localhost:3001/edit-shipment/SHIPMENT_ID`
3. **Expected**: Page loads after API call, form pre-filled
4. **Check**: Console shows API call logs

### **Scenario 3: Invalid Shipment ID**
1. Navigate to: `http://localhost:3001/edit-shipment/INVALID_ID`
2. **Expected**: Shows "Shipment Not Found" error
3. **Check**: Error message with helpful suggestions

## 📊 **Data Structure Mapping**

Based on the shipments table, these are the available fields:

```typescript
// Available API fields (from shipments table)
{
  shipment_id: string,
  sender_company_name: string,
  receiver_company_name: string,
  origin: string,
  destination: string,
  sender_areaname: string,
  receiver_areaname: string,
  sender_gst_no: string,
  receiver_gst_no: string,
  shipment_status: string,
  created_date: string,
  // ... other fields
}

// Form field mapping
name → sender_company_name
senderCompanyName → sender_company_name
receiverCompanyName → receiver_company_name
senderArea → sender_areaname
receiverArea → receiver_areaname
senderCity → origin (fallback)
receiverCity → destination (fallback)
pickupDate → created_date (fallback)
```

## 🔄 **Data Flow Diagram**

```
Shipments Table → Click Edit → Set Redux Store → Navigate → Load Form
                                     ↓
                              shipment data available
                                     ↓
                              Form initializes with data
                                     ↓
                              enableReinitialize updates form
```

## 🛠️ **Quick Fixes**

### **Fix 1: Clear Redux Store**
If data seems stale, clear the Redux store:

```typescript
// In browser console
localStorage.clear();
sessionStorage.clear();
// Refresh page
```

### **Fix 2: Check API Response**
If API call fails, check the response format:

```typescript
// In editShipmentSlice.ts - check console logs
console.log("API Response for shipment fetch:", response.data);
console.log("Shipments found:", shipments.length);
console.log("Looking for shipment ID:", shipmentId);
console.log("Found shipment:", foundShipment);
```

### **Fix 3: Verify Authentication**
Ensure user is properly authenticated:

```typescript
// Check in browser console
const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
console.log('User token:', userData?.Customerdetail?.token);
console.log('User ID:', userData?.Customerdetail?.id);
```

## 📝 **Next Steps**

1. **Test the debugging steps** above
2. **Check console logs** for specific error messages
3. **Verify field mapping** matches your API response
4. **Remove debug logs** once issue is resolved
5. **Consider caching** shipment data for better performance

The enhanced debugging should help identify exactly where the data flow is breaking and provide specific error messages to guide the fix! 🎯
