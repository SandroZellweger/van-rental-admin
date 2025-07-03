# Google Sheets Integration Setup Guide

## Making Your Google Sheet Accessible

To connect your Google Sheet with the admin dashboard, you need to make it publicly accessible. Follow these steps:

### Step 1: Share Your Google Sheet
1. Open your Google Sheet
2. Click **Share** button (top right)
3. Change access to **"Anyone with the link can view"**
4. Click **Done**

### Step 2: Publish to Web (Recommended)
1. In your Google Sheet, go to **File → Share → Publish to web**
2. Choose **"Entire Document"** or select specific sheet
3. Choose **"Web page"** format
4. Check **"Automatically republish when changes are made"**
5. Click **Publish**
6. Copy the published URL

### Step 3: Get Your Sheet URL
Use one of these URL formats:
- **Sharing URL**: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit?usp=sharing`
- **Published URL**: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0`
- **Just Sheet ID**: `SHEET_ID` (the long string of characters)

### Required Column Headers
Your Google Sheet must have these exact column headers in the first row:

| VehicleID | VehicleName | CalendarID | VehicleAdress | LicencePlate | ExtHight | ExtLength | ExtLarge | IntHight | IntLength | IntLarge |
|-----------|-------------|------------|---------------|--------------|----------|-----------|----------|----------|-----------|----------|
| N01 | Opel Vivaro (Losone) | cal_001 | Via dei Patrizi 1, 6616 Losone | TI 123456 | 2,27 | 5,40 | 2,07 | 1,86 | 3,12 | 1,83 |

### Example Data Format
```
VehicleID,VehicleName,CalendarID,VehicleAdress,LicencePlate,ExtHight,ExtLength,ExtLarge,IntHight,IntLength,IntLarge
N01,Opel Vivaro (Losone),cal_001,"Via dei Patrizi 1, 6616 Losone - Posteggio No 2",TI 123456,2.27,5.40,2.07,1.86,3.12,1.83
N02,Ford Transit (Bellinzona),cal_002,"Via Stazione 15, 6500 Bellinzona",TI 789012,2.52,6.20,2.13,1.98,3.70,1.87
```

### Troubleshooting

#### CORS Errors
If you get CORS (Cross-Origin) errors:
1. Make sure the sheet is published to web
2. Use the published URL, not the edit URL
3. Try accessing the sheet in an incognito window to verify it's public

#### Invalid Data
If data doesn't import correctly:
1. Check column headers match exactly
2. Ensure no empty rows at the top
3. Verify decimal numbers use commas (European format) or dots
4. Make sure addresses are properly quoted if they contain commas

#### Connection Issues
1. Test the URL in a browser first
2. Check your internet connection
3. Verify the sheet ID is correct
4. Try refreshing the page and reconnecting

### Data Privacy Note
- Only make sheets public that contain non-sensitive information
- Technical vehicle data is generally safe to share
- Avoid including personal data, pricing secrets, or sensitive business information
- Consider creating a separate public sheet with only necessary data

### Auto-Sync
Once connected, the system will:
- Preserve all your original data exactly as entered
- Add booking system fields automatically
- Classify vans as 'small' or 'large' for internal use
- Extract locations from addresses
- Calculate load volumes from dimensions
- Generate appropriate features and descriptions

The integration maintains your existing Google Sheet structure while making it compatible with modern booking systems.
