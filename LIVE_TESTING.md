# VanLife Admin - Live Testing

## 🚀 Live Deployment URLs

### GitHub Pages
- **Admin Dashboard**: `https://sandrozellweger.github.io/van-rental-admin/admin.html`
- **Media Manager Test**: `https://sandrozellweger.github.io/van-rental-admin/media-manager-test.html`
- **Test Image Generator**: `https://sandrozellweger.github.io/van-rental-admin/test-image-generator.html`

### Alternative Hosting Options

#### Netlify (Free)
1. Go to https://app.netlify.com/
2. Connect your GitHub repository
3. Deploy from `feature/media-manager` branch
4. Auto-deploy URL will be generated

#### Vercel (Free)
1. Go to https://vercel.com/
2. Import your GitHub repository
3. Deploy from `feature/media-manager` branch
4. Auto-deploy URL will be generated

#### Surge.sh (Free)
```bash
npm install -g surge
surge . your-domain.surge.sh
```

## 🧪 Testing Scenarios

### Cross-Device Testing
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Tablet browsers (iPad, Android tablets)

### Media Manager Features to Test
1. **Upload Images**
   - Drag & drop functionality
   - Click to browse and upload
   - Multiple file selection
   - File size validation (max 5MB)

2. **Image Assignment**
   - Assign images to specific vans
   - Set categories (exterior, interior, details)
   - Set primary images
   - Add descriptions

3. **Gallery Management**
   - View all uploaded images
   - Filter by van
   - Filter by category
   - Search functionality

4. **Image Operations**
   - Edit image details
   - Delete images
   - Download images
   - View image details

5. **Data Persistence**
   - Refresh page - data should persist
   - Close and reopen browser - data should remain

### Browser Compatibility Testing
- **Chrome**: Latest version
- **Firefox**: Latest version
- **Safari**: Latest version (macOS/iOS)
- **Edge**: Latest version
- **Mobile browsers**: Test responsive design

## 📱 Mobile Testing
- Portrait and landscape orientations
- Touch interactions
- Responsive design
- Upload from camera/gallery

## 🔧 Debug Tools
- Use browser developer tools (F12)
- Check console for errors
- Test localStorage functionality
- Verify image upload and display

## 📊 Performance Testing
- Image loading speed
- UI responsiveness
- Memory usage with multiple images
- Network requests optimization
