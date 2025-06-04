# React-based Pricing Calculation Implementation

## Overview
Successfully implemented the complex pricing calculation logic from JavaScript to React for the 4th step of the multi-step shipment form. The implementation includes metro/non-metro slab-based pricing, insurance calculations, handling charges, and GST calculations.

## Key Features Implemented

### 1. **Slab-based Weight Pricing**
- **Metro City Pricing**: 6 weight slabs with different rates per kg
- **Non-Metro City Pricing**: 6 weight slabs with different rates per kg
- **Fallback Rates**: Flat rates when slab-specific rates are not available
- **Dynamic Rate Selection**: Automatically selects the appropriate rate based on gross weight

### 2. **Insurance Calculation Logic**
- **AXLPL Insurance**: When user enables insurance by AXLPL
- **External Insurance**: When user has their own insurance policy
- **Rate-based Calculation**: Uses metro/non-metro insurance rates
- **Invoice Value Consideration**: Calculates additional insurance based on invoice vs policy value

### 3. **Handling Charges**
- **Product-based Charges**: Different handling charges for metro vs non-metro
- **Multiple Product Support**: Aggregates handling charges for multiple commodities
- **Dynamic Calculation**: Updates based on selected products/commodities

### 4. **GST and Total Calculation**
- **18% GST**: Applied to total charges before tax
- **Grand Total**: Final amount including all charges and GST
- **Real-time Updates**: Calculations update when form values change

## Technical Implementation

### **React Hooks Used**
- `useMemo`: For performance optimization of complex calculations
- Dependency array includes form values that affect calculations

### **Data Structures**
```typescript
interface PricingData {
  // Metro slabs (6 levels)
  metro_slab1_weight_from: string;
  metro_slab1_weight_to: string;
  metro_slab1_weight_comm: string;
  // ... (similar for slabs 2-6)
  
  // Non-metro slabs (6 levels)
  non_metro_slab1_weight_from: string;
  // ... (similar structure)
  
  // Fallback rates
  flate_rate_1: string;
  // ... (rates 1-6)
  
  // Insurance rates
  metro_insurance_charges: string;
  non_metro_insurance_charges: string;
}

interface ProductDetail {
  metro_handling_charges: string;
  non_metro_handling_charges: string;
  metro_insurance_charges: string;
  non_metro_insurance_charges: string;
}
```

### **Calculation Flow**
1. **Extract Form Values**: grossWeight, invoiceValue, insuranceValue, insurance flag
2. **Determine Location Type**: Metro vs Non-metro (currently mocked)
3. **Calculate Weight-based Charges**: Loop through slabs to find matching weight range
4. **Calculate Handling Charges**: Sum up charges from all selected products
5. **Calculate Insurance**: Based on AXLPL vs external insurance logic
6. **Calculate Totals**: Sum all charges, apply GST, calculate grand total

### **Form Integration**
- **Real-time Updates**: Calculations update when user changes weight, invoice value, or insurance settings
- **Disabled Fields**: All calculation fields are read-only and display calculated values
- **Formatted Display**: All monetary values formatted to 2 decimal places

## Mock Data Structure
Currently using mock data for demonstration. In production, this should be replaced with:
- **API Integration**: Fetch pricing slabs from backend
- **Redux Store**: Store pricing data in application state
- **Location Detection**: Determine metro/non-metro based on delivery address
- **Product Integration**: Use actual selected commodities for handling charges

## Files Modified
- `src/components/pagecomponents/addshipmentpage/StepFourFormFields.tsx`

## Future Enhancements
1. **API Integration**: Replace mock data with real API calls
2. **Location Detection**: Implement metro/non-metro detection based on pincode
3. **Product Integration**: Connect with commodity selection from step 1
4. **Custom Rates**: Support for customer-specific pricing
5. **Currency Formatting**: Add proper currency formatting with symbols
6. **Validation**: Add validation for calculation inputs
7. **Error Handling**: Handle edge cases and API failures gracefully

## Testing Recommendations
1. **Unit Tests**: Test calculation logic with various weight ranges
2. **Integration Tests**: Test form integration and real-time updates
3. **Edge Cases**: Test with zero values, very large weights, etc.
4. **Performance Tests**: Ensure calculations don't impact form performance

## Usage
The pricing calculations automatically run when:
- User enters gross weight
- User changes invoice value
- User toggles insurance settings
- User modifies insurance value

All calculated fields are automatically populated and update in real-time as the user fills out the form.
