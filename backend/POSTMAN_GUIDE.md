# Testing the Building Rules API with Postman

This guide will help you test the building rule creation API with Postman.

## Getting Admin Token

1. **Create a POST request to login as admin:**
   - URL: `http://localhost:8081/admin/login`
   - Body: Raw JSON
   ```json
   {
     "email": "admin@example.com",
     "password": "your_admin_password"
   }
   ```
   - Send the request and copy the token from the response

## Creating Building Rules with File Upload

1. **Create a POST request:**
   - URL: `http://localhost:8081/api/simple-building-rules`

2. **Add Authorization:**
   - Type: Bearer Token
   - Token: Paste the token you copied from the login response

3. **Set up the Body:**
   - Select "form-data" (very important)
   - Add the following key-value pairs:
   
   | Key          | Type | Value                       |
   |--------------|------|----------------------------|
   | cityName     | Text | TestCity                   |
   | pincode      | Text | 123456                     |
   | documentFile | File | [Select your PDF file]     |
   | rules        | Text | [Paste rules JSON below]   |

4. **Sample rules JSON:**
   ```json
   [
     {
       "sequence": 1,
       "roomType": "bedroom",
       "description": "Master Bedroom requirements",
       "dimensions": {
         "minLength": 3.5,
         "minWidth": 3,
         "minArea": 10.5,
         "maxLength": 10,
         "maxWidth": 8,
         "maxArea": 80,
         "unit": "meters"
       },
       "additionalRequirements": "Must have at least one window",
       "isRequired": true
     },
     {
       "sequence": 2,
       "roomType": "kitchen",
       "description": "Kitchen requirements",
       "dimensions": {
         "minLength": 2.5,
         "minWidth": 2,
         "minArea": 5,
         "unit": "meters"
       },
       "additionalRequirements": "Must have ventilation",
       "isRequired": true
     }
   ]
   ```

5. **Send the request**
   - You should receive a "201 Created" response with the created rule details

## Troubleshooting

### "Unexpected field" Error
If you get an "Unexpected field" error, make sure:
- The file field is named exactly `documentFile` (case-sensitive)
- You're using form-data (not raw JSON, x-www-form-urlencoded, etc.)
- You've selected File type for the documentFile field in Postman
- You're not nesting the file field inside any other object

### Authentication Errors
- Make sure you're using the correct token
- The token may have expired - get a new one
- Prefix the token with "Bearer " if using the "Authorization" header directly

### File Upload Issues
- Ensure the file is in a supported format (PDF, TXT, DOC, DOCX)
- File size should be under 10MB
- Try with a smaller, simpler file first

### Running Test Scripts in PowerShell
Since PowerShell doesn't support the `&&` operator for command chaining, run these commands in two separate terminal windows:

**Terminal 1:**
```
cd backend
npm run start
```

**Terminal 2:**
```
cd backend
node test-multer-field.js
```

## Field Names
The API now supports both field names:
- `documentFile` (preferred)
- `file` (alternative)

Either name will work for the file upload field. 