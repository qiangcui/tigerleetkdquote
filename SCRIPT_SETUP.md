# Email Service Setup Guide

To enable email notifications and signature capture, we use Google Apps Script. This acts as a free backend server for your quote.

### Step 1: Create or Update the Script
1. Go to [script.google.com](https://script.google.com/).
2. Open your project (e.g., "Website Quote Backend").
3. Replace **all** code in `Code.gs` with the code below:

```javascript
function doPost(e) {
  // Prevent concurrent access issues
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // Parse the data sent from the website
    var data = JSON.parse(e.postData.contents);

    // --- CONFIGURATION ---
    var DEVELOPER_EMAIL = "gloriacloudco@gmail.com"; // <--- CHANGE THIS to your email
    // ---------------------

    // 1. Prepare Email Content
    var subject = "✅ Quote Accepted: " + data.clientName;
    
    // Common body content for both parties
    var detailsParams = 
               "-------------------------------------------\n" +
               "DETAILS:\n" +
               "Client: " + data.clientName + "\n" +
               "Signer: " + data.signerName + " (" + data.signerEmail + ")\n" +
               "Date: " + data.date + "\n" +
               "Quote Ref: " + data.quoteNumber + "\n\n" +
               "FINANCIALS:\n" +
               "Setup Fee: $" + data.pricing.setup + "\n" +
               "Monthly Fee: $" + data.pricing.monthly + "\n" +
               "-------------------------------------------\n\n";

    var developerBody = "Great news! The proposal has been accepted.\n\n" +
                        detailsParams + 
                        "The signed proposal PDF is attached to this email.";

    var clientBody = "Dear " + data.signerName + ",\n\n" +
                     "Thank you for accepting the proposal for " + data.clientName + ".\n" +
                     "Here is a copy of the details for your records:\n\n" +
                     detailsParams +
                     "A copy of the full signed proposal is attached to this email.\n\n" +
                     "I will be in touch shortly to coordinate the next steps.\n\n" +
                     "Best regards,\n" +
                     "Gloria Cloud";

    // 2. Prepare Attachments
    var attachments = [];

    // PDF Attachment (Primary)
    if (data.pdfData) {
      // Remove header string "data:application/pdf;base64," if present, though html2pdf usually gives full string
      // We need to split to get just the base64 part
      var pdfParts = data.pdfData.split(',');
      var pdfBase64 = pdfParts.length > 1 ? pdfParts[1] : pdfParts[0];
      
      var pdfBlob = Utilities.newBlob(Utilities.base64Decode(pdfBase64), 'application/pdf', 'Proposal_' + data.clientName.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf');
      attachments.push(pdfBlob);
    }
    
    // Fallback: Signature Image Attachment (if no PDF for some reason, or as extra)
    if (!data.pdfData && data.signatureImage) {
      var sigParts = data.signatureImage.split(',');
      var sigBase64 = sigParts.length > 1 ? sigParts[1] : sigParts[0];
      var imageBlob = Utilities.newBlob(Utilities.base64Decode(sigBase64), 'image/png', 'signature.png');
      attachments.push(imageBlob);
    }

    // 3. Send Email to Developer
    MailApp.sendEmail({
      to: DEVELOPER_EMAIL,
      subject: subject,
      body: developerBody,
      attachments: attachments
    });

    // 4. Send Confirmation Email to Client
    MailApp.sendEmail({
      to: data.signerEmail,
      subject: "Confirmation: Proposal Accepted - " + data.clientName,
      body: clientBody,
      attachments: attachments
    });

    // Return success
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

### Step 2: Deploy (Important!)
**If this is a new script:**
1. Click **Deploy** > **New deployment**.
2. Select **Web app**.
3. Set **Who has access** to **Anyone**.
4. Click **Deploy**.

**If you are updating an existing script:**
1. Click **Deploy** > **Manage deployments**.
2. Click the **pencil icon** (Edit) next to your active deployment.
3. Click the **Version** dropdown and select **New version**.
4. Click **Deploy**. (This is crucial! If you don't create a new version, your code changes won't be live).

### Step 3: Connect
1. Ensure the **Web App URL** in `App.tsx` matches your deployment URL.
