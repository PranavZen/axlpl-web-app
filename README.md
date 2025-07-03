# 📁 Project Folder Structure

This document outlines the organized folder structure for the AXLPL Web Application.

## 🏗️ Current Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, Select, etc.)
│   │   ├── button/      # Button component
│   │   ├── input/       # Input component
│   │   ├── select/      # Select component
│   │   ├── modal/       # Modal components
│   │   ├── table/       # Table components
│   │   ├── sidebar/     # Sidebar component
│   │   └── ...          # Other UI components
│   ├── auth/            # Authentication related components
│   │   └── ProtectedRoute.tsx
│   ├── pagecomponents/  # Page-specific components
│   │   ├── dashboardpage/
│   │   ├── addshipmentpage/
│   │   ├── addressespage/
│   │   └── editprofile/

│
├── pages/               # Page components (TSX only)
│   ├── Dashboard.tsx
│   ├── SignIn.tsx
│   ├── AddShipement.tsx
│   ├── EditProfile.tsx
│   ├── ChangePassword.tsx
│   ├── ShipmentsPage.tsx
│   └── Addresses.tsx
│
├── styles/              # All SCSS files (NEW - REORGANIZED)
│   ├── global/          # Global styles
│   │   ├── Global.scss
│   │   ├── AddShipment.scss
│   │   └── _mixin.scss
│   ├── pages/           # Page-specific styles
│   │   ├── EditProfile.scss
│   │   └── ChangePassword.scss
│   └── index.scss       # Main styles entry point
│
├── redux/               # Redux store and slices
│   ├── slices/          # Redux slices
│   │   ├── authSlice.ts
│   │   ├── profileSlice.ts
│   │   ├── shipmentSlice.ts
│   │   ├── changePasswordSlice.ts
│   │   └── ...
│   └── store.ts         # Redux store configuration
│
├── types/               # TypeScript type definitions (NEW)
│   └── index.ts         # Global type definitions
│
├── constants/           # Application constants (NEW)
│   └── index.ts         # API endpoints, routes, validation rules, etc.
│
├── services/            # API services (NEW)
│   └── api.ts           # Axios configuration and API methods
│
├── utils/               # Utility functions
│   ├── authUtils.ts
│   ├── toastUtils.ts
│   ├── validationUtils.ts
│   ├── exportUtils.ts
│   └── ...
│
├── hooks/               # Custom React hooks
│   ├── useConfig.ts
│   └── index.ts
│
├── contexts/            # React contexts
│   └── SidebarContext.tsx
│
├── config/              # Configuration files
│   └── index.ts
│
├── App.tsx              # Main App component
└── index.tsx            # Application entry point
```

## 📋 Folder Descriptions

### `/components`
- **`/ui`**: Reusable UI components (Button, Input, Modal, etc.)
- **`/auth`**: Authentication-related components
- **`/pagecomponents`**: Page-specific components


### `/pages`
- Contains only page-level components (TSX files)
- No SCSS files (moved to `/styles/pages`)

### `/styles` ✨ NEW
- **`/global`**: Global styles, mixins, and shared SCSS
- **`/pages`**: Page-specific SCSS files

- **`index.scss`**: Main entry point for all styles

### `/types` ✨ NEW
- TypeScript type definitions
- Interfaces for API responses, form data, etc.

### `/constants` ✨ NEW
- Application constants
- API endpoints, routes, validation rules
- Error messages, success messages

### `/services` ✨ NEW
- API service layer
- Axios configuration
- HTTP request methods

### `/redux`
- Redux store configuration
- Redux slices for state management

### `/utils`
- Utility functions
- Helper methods for common operations

## 🔄 Migration Status

### ✅ Completed
- [x] Created new folder structure
- [x] Moved SCSS files to `/styles` directory
- [x] Updated import paths in components
- [x] Created type definitions in `/types`
- [x] Created constants in `/constants`
- [x] Created API service in `/services`

### 📋 TODO
- [ ] Rename `/redux` to `/store` (when not in use)
- [ ] Move page-specific components to `/features`
- [ ] Create custom hooks for common logic
- [ ] Add barrel exports (index.ts files)

## 📝 Best Practices

1. **Import Paths**: Use relative imports for local files, absolute for external packages
2. **File Naming**: Use PascalCase for components, camelCase for utilities
3. **Folder Organization**: Group related files together
4. **Type Safety**: Define types in `/types` and import where needed
5. **Constants**: Use constants from `/constants` instead of hardcoded values

## 🚀 Benefits

- **Better Organization**: Clear separation of concerns
- **Easier Maintenance**: Related files are grouped together
- **Improved Scalability**: Easy to add new features
- **Type Safety**: Centralized type definitions
- **Consistent Styling**: Organized SCSS structure
- **Reusability**: Better component organization
