# Google Sheets Setup for Van Management

## Overview
The admin dashboard can sync van and pricing data from Google Sheets, allowing you to manage your fleet data in a familiar spreadsheet interface while keeping your website automatically updated.

## Google Sheets Structure

### Van Data Sheet

Create a Google Sheet with the following columns in the first row (headers):

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I | Column J | Column K | Column L |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| id | name | type | enabled | location | base_price | capacity | pricing_profile | calendar_id | features | description | image_url |

#### Example Van Data:
```
1	Compact Van #1	compact	TRUE	City Center	80	2	standard	compact-van-1@example.com	GPS,AC,Bluetooth	Perfect for city trips	https://example.com/van1.jpg
2	Standard Van #1	standard	TRUE	Downtown	120	4	premium	standard-van-1@example.com	GPS,AC,Kitchen,Bed	Great for families	https://example.com/van2.jpg
3	Luxury Van #1	luxury	TRUE	Hotel District	180	4	luxury	luxury-van-1@example.com	GPS,AC,Kitchen,Bed,Solar	Ultimate comfort	https://example.com/van3.jpg
```

### Pricing Profiles Sheet

Create another sheet (or tab) with the following columns:

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| id | name | description | base_price | weekend_multiplier | holiday_multiplier | minimum_days | active | cancellation_policy |

#### Example Pricing Data:
```
standard	Standard Pricing	Default pricing for most vans	100	1.2	1.5	1	TRUE	24h free cancellation
premium	Premium Pricing	Higher pricing for premium vans	150	1.3	1.6	2	TRUE	48h free cancellation
luxury	Luxury Pricing	Premium pricing for luxury vans	200	1.4	1.8	3	TRUE	72h free cancellation
family	Family Pricing	Family-friendly pricing	130	1.25	1.4	2	TRUE	48h free cancellation
```

## Setup Instructions

### 1. Create the Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Create two sheets/tabs:
   - "Vans" (for van data)
   - "Pricing" (for pricing profiles)

### 2. Set Up Van Data
1. In the "Vans" sheet, add the headers in row 1 as shown above
2. Add your van data starting from row 2
3. Make sure the `enabled` column uses TRUE/FALSE values
4. The `features` column should be comma-separated (e.g., "GPS,AC,Bluetooth")
5. Use valid pricing profile IDs that match your pricing sheet

### 3. Set Up Pricing Data
1. In the "Pricing" sheet, add the headers in row 1 as shown above
2. Add your pricing profiles starting from row 2
3. Multipliers should be decimal values (1.2 = 20% increase)
4. Use TRUE/FALSE for the `active` column

### 4. Share the Sheet
1. Click the "Share" button in the top-right corner
2. Change permissions to "Anyone with the link can view"
3. Copy the sharing URL

### 5. Connect to Admin Dashboard
1. Open your admin dashboard
2. Navigate to the "Google Sheets" section
3. Click "Connect Sheets"
4. Paste the sheet URL in both "Van Data Sheet" and "Pricing Data Sheet" fields
5. Adjust the ranges if needed:
   - Van data: `Vans!A1:L100`
   - Pricing data: `Pricing!A1:I100`
6. Click "Test Connection" for both sheets
7. Once connected, use "Sync Now" to import the data

## Data Synchronization

### Automatic Sync
- The system can automatically sync data every 5-60 minutes
- Configure this in the admin dashboard under "Sync Settings"

### Manual Sync
- Use the "Sync Now" button to immediately pull the latest data
- Recommended after making changes to your Google Sheet

### Van Status Management
- Use the toggle switches in the admin dashboard to enable/disable vans
- This will override the `enabled` field in your Google Sheet
- Changes made in the admin will sync back to Google Sheets

## Advanced Features

### Pricing Profile Assignment
- Assign different pricing profiles to vans directly in the admin dashboard
- The dropdown will show all active pricing profiles from your Google Sheet
- Changes are immediately reflected in pricing calculations

### Real-time Updates
- When you update data in Google Sheets, it will be reflected on your website after the next sync
- Van availability, pricing, and details are all synchronized
- Disabled vans will not appear on the main booking website

## Tips and Best Practices

1. **Backup Your Data**: Keep a backup copy of your Google Sheet
2. **Test Changes**: Use the preview feature to verify data before importing
3. **Consistent Formatting**: Maintain consistent data formatting for reliable syncing
4. **Validate IDs**: Ensure pricing profile IDs in van data match actual profile IDs
5. **Monitor Sync Status**: Check the admin dashboard regularly for sync errors

## Troubleshooting

### Common Issues:
- **Connection Failed**: Check if the sheet URL is correct and publicly accessible
- **Data Not Syncing**: Verify the data ranges are correct and contain valid data
- **Missing Vans**: Check if vans are enabled and have valid pricing profiles
- **Pricing Errors**: Ensure pricing profile IDs match between van data and pricing sheets

### Support:
If you encounter issues, check the browser console for detailed error messages and refer to the admin dashboard's sync status indicators.
