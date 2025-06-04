# Edit Shipment Form Fields Testing Guide

## 🎯 **Goal: Display Shipment Data in Form Input Fields**

The edit shipment form should display actual shipment data in the input fields, not just in debug panels. This guide helps test and verify that form fields are properly populated.

## 🔧 **Enhanced Debugging Features**

### **1. Comprehensive Console Logging**
```
🔍 Form Debug Info:
Current form values: {...}
Shipment data in form: {...}
Initial values used: {...}

🔍 Field Comparison:
Form name: "value" | Shipment sender_company_name: "value"
Form senderCompanyName: "value" | Shipment sender_company_name: "value"
```

### **2. Real-time Form Values Display**
Shows current form values that update as you type or use buttons:
```
📝 Current Form Values (Real-time):
• name: "Company Name"
• senderCompanyName: "Sender Company"
• receiverCompanyName: "Receiver Company"
• netWeight: "100"
```

### **3. Test Buttons**
- **🧪 Test Data**: Populates form with sample test data
- **📦 Shipment Data**: Populates form with actual shipment data

## 🧪 **Step-by-Step Testing**

### **Step 1: Access Edit Page**
1. Navigate to: `http://localhost:3001/shipments/approved`
2. Click "Edit" on any active shipment
3. Should navigate to: `/edit-shipment/SHIPMENT_ID`

### **Step 2: Check Initial State**
Look for these debug sections:

**Debug Panel (Top):**
```
🔍 Debug Info:
✅ Shipment Data Available: Yes
📝 Form Values Preview:
• Name: [should show company name]
• Sender Company: [should show sender company]
```

**Real-time Values (In Form):**
```
📝 Current Form Values (Real-time):
• name: [should show value or 'empty']
• senderCompanyName: [should show value or 'empty']
```

### **Step 3: Test Manual Population**

**Test with Sample Data:**
1. Click "🧪 Test Data" button
2. Check console for: `🧪 Populating test data...`
3. Verify form fields update with test values
4. Check real-time display updates

**Test with Shipment Data:**
1. Click "📦 Shipment Data" button
2. Check console for: `📦 Populating with actual shipment data...`
3. Verify form fields update with actual shipment values

### **Step 4: Verify Input Fields**
Check these specific input fields in Step 1:

- **Name field**: Should show company name (might be disabled)
- **Net Weight**: Should show weight value
- **Gross Weight**: Should show weight value  
- **Number of Parcel**: Should show parcel count
- **Invoice Value**: Should show invoice amount

### **Step 5: Check Console Logs**
Open browser console and verify these logs appear:

```
🔧 Name already set to: [company name]
🔍 Form Debug Info:
Current form values: {name: "...", senderCompanyName: "..."}
🔍 Field Comparison:
Form name: "value" | Shipment sender_company_name: "value"
```

## 🔍 **Troubleshooting Checklist**

### **✅ Data Flow Verification**
- [ ] Debug panel shows "Shipment Data Available: Yes"
- [ ] Console shows shipment data received
- [ ] Initial values contain shipment data
- [ ] Real-time display shows form values

### **✅ Form Field Population**
- [ ] Test Data button populates fields successfully
- [ ] Shipment Data button populates fields successfully
- [ ] Real-time display updates when buttons are clicked
- [ ] Input fields visually show the populated values

### **✅ Specific Field Checks**
- [ ] Name field shows company name (check if disabled)
- [ ] Text inputs show string values
- [ ] Number inputs show numeric values
- [ ] Dropdown fields show selected options

## 🐛 **Common Issues & Solutions**

### **Issue 1: Fields Populate but Don't Display**
**Symptoms**: Console shows values updated but input fields appear empty
**Check**: 
- Input field `value` attribute in browser inspector
- CSS styling hiding text (color, opacity)
- Input field `disabled` state

### **Issue 2: Test Buttons Don't Work**
**Symptoms**: Clicking buttons doesn't update fields
**Check**:
- Console for error messages
- `setFieldValue` function calls
- Formik form state

### **Issue 3: Initial Values Not Applied**
**Symptoms**: Form loads empty despite having shipment data
**Check**:
- Formik `enableReinitialize` prop
- Formik `key` prop for re-initialization
- Initial values function execution

### **Issue 4: Some Fields Work, Others Don't**
**Symptoms**: Basic fields populate but dropdowns/selects don't
**Check**:
- Field type (string vs object for dropdowns)
- Component-specific value handling
- API data structure for complex fields

## 🎯 **Expected Results**

After testing, you should see:

### **✅ Visual Confirmation**
1. **Input fields contain values**: Text visible in form inputs
2. **Real-time display matches**: Debug display matches input values
3. **Test buttons work**: Both buttons populate fields successfully
4. **Console logs confirm**: Detailed logging shows data flow

### **✅ Functional Verification**
1. **Form validation works**: Required fields show validation
2. **Navigation preserves data**: Moving between steps keeps values
3. **Submit preparation**: Form ready for submission with populated data

## 🚀 **Success Criteria**

The form fields are working correctly when:

- ✅ **Input fields visually display shipment data**
- ✅ **Test buttons successfully populate fields**
- ✅ **Real-time debug display matches input values**
- ✅ **Console logs confirm proper data flow**
- ✅ **Form validation works with populated data**

## 📝 **Next Steps**

1. **Run through all test steps** systematically
2. **Document any fields that don't populate** correctly
3. **Check specific field types** (text, number, dropdown, etc.)
4. **Verify form submission** works with populated data
5. **Remove debug features** once everything works correctly

The enhanced debugging should help identify exactly where the form field population is failing and provide clear visual confirmation when it's working correctly! 🎯
