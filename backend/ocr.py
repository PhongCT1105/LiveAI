import os
from google.cloud import documentai

# Load JSON key for authentication
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "fridgeai-451708-a527cd0d58e9.json"

# Google Cloud Project and Processor Details
PROJECT_ID = "your-project-id"
PROCESSOR_ID = "your-processor-id"
LOCATION = "us"  # Change if your processor is in a different region

def extract_text_from_receipt(image_path):
    """Extracts text from a receipt using Google Cloud Document AI"""
    client = documentai.DocumentProcessorServiceClient()

    with open(image_path, "rb") as image_file:
        image_content = image_file.read()

    # Document payload
    raw_document = documentai.RawDocument(content=image_content, mime_type="image/png")  # Use "image/jpeg" for JPGs

    # Process the document
    request = documentai.ProcessRequest(
        name=f"projects/{PROJECT_ID}/locations/{LOCATION}/processors/{PROCESSOR_ID}",
        raw_document=raw_document
    )

    response = client.process_document(request=request)

    # Extract text from the response
    document_text = response.document.text
    print("Extracted Text:\n", document_text)

    return document_text

# Test the OCR
ocr_text = extract_text_from_receipt("test.png")
print("Final OCR Output:\n", ocr_text)
