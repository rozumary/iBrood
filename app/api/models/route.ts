export async function GET() {
  const folders = [
    "OBJECT DETECTION MODELS",
    "SEGMENTATION MODELS"
  ];
  
  return Response.json({ folders });
}
