# Van Rental Admin Dashboard - Complete Setup Guide

## 🚀 Quick Start

Your van rental admin dashboard is ready to use! This guide will help you import your Google Sheets data in just a few minutes.

## 📊 Google Sheets Integration

### What Happens When You Connect

When you click "Connect to Google Sheets", one of two things will happen:

1. **Direct Connection** (rare): Data imports automatically
2. **Browser Security Mode** (common): You'll see a manual import option

**⚠️ Important: If you see "Direct connection blocked by browser security" - this is NORMAL and expected!**

Modern browsers (Chrome, Firefox, Safari, Edge) block direct access to Google Sheets for security reasons. This is not an error - it's proper security behavior.

### The 3-Step Manual Import Process

When browser security blocks direct access, you'll see a simple 3-step process:

#### Step 1: Download Your Data
- Click the "Download CSV from Google Sheets" link
- This opens your sheet data in a new tab
- The data appears as comma-separated values

#### Step 2: Copy and Paste
- Select all the data (Ctrl+A or Cmd+A)
- Copy it (Ctrl+C or Cmd+C)
- Paste it into the text area in the admin dashboard

#### Step 3: Import
- Click "Import Vehicle Data"
- The system processes your data and imports all vehicles

**✅ This method works 100% of the time and preserves all your technical data!**

## 🛠️ Google Sheets Setup

### 1. Make Your Sheet Public

Your Google Sheet must be set to "Anyone with the link can view":

1. Open your Google Sheet
2. Click "Share" (top right)
3. Change access to "Anyone with the link"
4. Set permission to "Viewer"
5. Copy the sheet URL

### 2. Required Data Format

Your sheet must have these exact column headers in row 1:

```
VehicleID, VehicleName, CalendarID, VehicleAdress, LicencePlate, ExtHight, ExtLength, ExtLarge, IntHight, IntLength, IntLarge
```

### 3. Example Data Row

```
N01, "Opel Vivaro (Losone)", cal_001, "Via dei Patrizi 1, 6616 Losone", TI 148877, 1.97, 5.2, 2.24, 1.38, 2.8, 1.27
```

## 📋 Data Fields Explained

### Original Technical Fields (Preserved)
- **VehicleID**: Unique identifier (e.g., N01, N02)
- **VehicleName**: Full vehicle name and location
- **CalendarID**: Calendar system identifier
- **VehicleAdress**: Vehicle pickup location
- **LicencePlate**: Vehicle license plate
- **ExtHight**: External height in meters
- **ExtLength**: External length in meters  
- **ExtLarge**: External width in meters
- **IntHight**: Internal height in meters
- **IntLength**: Internal cargo length in meters
- **IntLarge**: Internal cargo width in meters

### System-Added Fields
- **Type**: Automatically classified as "small" or "large"
- **Price**: Default pricing (can be customized)
- **Status**: Availability status
- **Features**: Calculated based on dimensions
- **Load Volume**: Calculated internal volume

## 🔧 Troubleshooting

### "No data appears when I click the download link"
- Ensure your Google Sheet is set to "Anyone with the link can view"
- Try right-clicking the download link and select "Open in new tab"

### "Wrong format error"
- Check that your sheet has the exact column headers shown above
- Ensure there are no extra spaces in header names
- Make sure row 1 contains headers, row 2+ contains data

### "Import failed"
- Verify all required columns are present
- Check that numeric fields (dimensions) contain valid numbers
- Ensure VehicleID values are unique

### "Blank page after clicking download"
- Your sheet might not be public - check sharing settings
- Try copying the CSV URL directly into a new browser tab

## 📈 Next Steps

After importing your vehicle data:

1. **Review Imported Vehicles**: Check that all technical data is preserved
2. **Set Up Pricing Profiles**: Configure different pricing tiers
3. **Test Booking System**: Try creating test bookings
4. **Customize Settings**: Adjust features and descriptions as needed

## 🔄 Regular Updates

To update vehicle data:

1. Update your Google Sheet
2. Return to the admin dashboard
3. Click "Sync Now" in the Google Sheets section
4. Use the same 3-step process to import updated data

## 💡 Pro Tips

- **Data Backup**: Always keep a backup copy of your Google Sheet
- **Regular Sync**: Update the dashboard whenever you change vehicle information
- **Browser Compatibility**: The system works with all modern browsers
- **Mobile Access**: The admin dashboard is fully responsive for mobile use

## 🆘 Need Help?

If you encounter any issues:

1. Check that your Google Sheet is publicly accessible
2. Verify the column headers match exactly
3. Ensure all required data fields are filled
4. Try the manual import process - it works reliably

The system is designed to handle all common scenarios and preserve your valuable technical vehicle data while adding modern booking system capabilities.
