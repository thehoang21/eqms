# Document Converter Service - Backend Implementation Guide

## Overview
Service to convert Word documents (.doc, .docx) to PDF format for preview in the application.

## API Endpoint

### Convert Document to PDF
**Endpoint:** `POST /api/documents/convert-to-pdf`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `file`: File (Word document)
  - `fileName`: string (optional)

**Response:**
- Content-Type: application/pdf
- Body: PDF file as binary blob

**Error Response:**
```json
{
  "success": false,
  "error": "Conversion failed: [reason]"
}
```

### Health Check
**Endpoint:** `GET /api/documents/conversion-status`

**Response:**
```json
{
  "available": true,
  "service": "LibreOffice",
  "version": "7.x"
}
```

## Implementation Options

### Option 1: LibreOffice (Recommended)
**Pros:** Free, reliable, supports all formats
**Cons:** Requires LibreOffice installation

```bash
# Install LibreOffice
sudo apt-get install libreoffice

# Convert command
libreoffice --headless --convert-to pdf --outdir /tmp input.docx
```

**Node.js Implementation:**
```javascript
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

app.post('/api/documents/convert-to-pdf', upload.single('file'), async (req, res) => {
    try {
        const inputPath = req.file.path;
        const outputDir = path.dirname(inputPath);
        
        // Convert using LibreOffice
        await new Promise((resolve, reject) => {
            exec(
                `libreoffice --headless --convert-to pdf --outdir ${outputDir} ${inputPath}`,
                (error, stdout, stderr) => {
                    if (error) reject(error);
                    else resolve(stdout);
                }
            );
        });
        
        const pdfPath = inputPath.replace(/\.(docx?|odt)$/i, '.pdf');
        const pdfBuffer = fs.readFileSync(pdfPath);
        
        // Cleanup
        fs.unlinkSync(inputPath);
        fs.unlinkSync(pdfPath);
        
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

### Option 2: Node.js Library (libre-office-convert)
```bash
npm install libre-office-convert
```

```javascript
const libreConvert = require('libre-office-convert');
const fs = require('fs');

app.post('/api/documents/convert-to-pdf', upload.single('file'), async (req, res) => {
    try {
        const docxBuffer = fs.readFileSync(req.file.path);
        
        libreConvert.convert(docxBuffer, '.pdf', undefined, (err, pdfBuffer) => {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }
            
            // Cleanup
            fs.unlinkSync(req.file.path);
            
            res.contentType('application/pdf');
            res.send(pdfBuffer);
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

### Option 3: Python with docx2pdf
```bash
pip install docx2pdf
```

```python
from flask import Flask, request, send_file
from docx2pdf import convert
import os

@app.route('/api/documents/convert-to-pdf', methods=['POST'])
def convert_to_pdf():
    if 'file' not in request.files:
        return {'success': False, 'error': 'No file provided'}, 400
    
    file = request.files['file']
    input_path = f'/tmp/{file.filename}'
    output_path = input_path.replace('.docx', '.pdf')
    
    file.save(input_path)
    
    try:
        convert(input_path, output_path)
        response = send_file(output_path, mimetype='application/pdf')
        
        # Cleanup
        os.remove(input_path)
        os.remove(output_path)
        
        return response
    except Exception as e:
        return {'success': False, 'error': str(e)}, 500
```

### Option 4: Commercial API (CloudConvert)
```javascript
const CloudConvert = require('cloudconvert');

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

app.post('/api/documents/convert-to-pdf', upload.single('file'), async (req, res) => {
    try {
        const job = await cloudConvert.jobs.create({
            tasks: {
                'import-file': {
                    operation: 'import/upload'
                },
                'convert-file': {
                    operation: 'convert',
                    input: 'import-file',
                    output_format: 'pdf'
                },
                'export-file': {
                    operation: 'export/url',
                    input: 'convert-file'
                }
            }
        });
        
        // Upload file
        const uploadTask = job.tasks.filter(task => task.name === 'import-file')[0];
        await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(req.file.path));
        
        // Wait for conversion
        const completedJob = await cloudConvert.jobs.wait(job.id);
        const exportTask = completedJob.tasks.filter(task => task.name === 'export-file')[0];
        
        // Download PDF
        const file = exportTask.result.files[0];
        const pdfResponse = await fetch(file.url);
        const pdfBuffer = await pdfResponse.buffer();
        
        // Cleanup
        fs.unlinkSync(req.file.path);
        
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

## Docker Setup (Recommended)

```dockerfile
FROM node:18

# Install LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

## Security Considerations

1. **File Validation:**
   - Check file size limits (max 10MB)
   - Validate MIME types
   - Scan for malware

2. **Temporary File Cleanup:**
   - Always delete uploaded files after processing
   - Use temporary directories with auto-cleanup

3. **Rate Limiting:**
   - Limit conversion requests per user/IP
   - Implement queue system for heavy loads

4. **Error Handling:**
   - Timeout for long conversions (30 seconds)
   - Graceful failure messages
   - Log errors for debugging

## Testing

```bash
# Test conversion
curl -X POST http://localhost:3000/api/documents/convert-to-pdf \
  -F "file=@sample.docx" \
  --output converted.pdf

# Test health check
curl http://localhost:3000/api/documents/conversion-status
```

## Performance Optimization

1. **Caching:**
   - Cache converted PDFs by file hash
   - Use Redis for cache storage
   - Set TTL to 1 hour

2. **Queue System:**
   - Use Bull or RabbitMQ for job queue
   - Process conversions in background workers
   - Return job ID, poll for completion

3. **Parallel Processing:**
   - Run multiple LibreOffice instances
   - Use worker threads/child processes

## Next Steps

1. Choose implementation option based on infrastructure
2. Deploy backend service
3. Update `VITE_API_BASE_URL` in `.env`
4. Test conversion with real documents
5. Monitor performance and errors
