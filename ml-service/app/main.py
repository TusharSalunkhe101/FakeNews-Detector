from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from app.preprocessing.text_cleaner import TextCleaner
from app.nlp.claim_extractor import ClaimExtractor
from app.nlp.linguistic_analyzer import LinguisticAnalyzer
from app.nlp.sentiment_analyzer import SentimentAnalyzer
from app.nlp.clickbait_detector import ClickbaitDetector
from app.utils.source_evaluator import SourceEvaluator
from app.ocr.ocr_engine import OCREngine
from app.inference.predictor import NewsPredictor

app = FastAPI(
    title="Fake News Detector - AIML Service",
    description="Explainable Hybrid AI/ML and NLP Engine for Fake News Detection",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = NewsPredictor()

class TextAnalysisRequest(BaseModel):
    headline: Optional[str] = ""
    text: str
    source_url: Optional[str] = ""

class ClaimAnalysisRequest(BaseModel):
    text: str

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Fake News AIML Engine",
        "model_loaded": predictor.pipeline is not None
    }

@app.get("/metrics")
def get_metrics():
    return predictor.get_metrics()

@app.post("/analyze/text")
def analyze_text(request: TextAnalysisRequest):
    cleaned_text = TextCleaner.clean(request.text)
    cleaned_headline = TextCleaner.clean(request.headline or "")
    
    if not cleaned_text and not cleaned_headline:
        raise HTTPException(status_code=400, detail="Please provide headline or article content.")

    # 1. Claims extraction
    claims = ClaimExtractor.extract_claims(cleaned_text or cleaned_headline)
    
    # 2. Linguistic analysis
    linguistic = LinguisticAnalyzer.analyze(cleaned_text, cleaned_headline)
    
    # 3. Sentiment & Emotion
    sentiment = SentimentAnalyzer.analyze(cleaned_text or cleaned_headline)
    
    # 4. Clickbait detection
    clickbait = ClickbaitDetector.analyze_headline(cleaned_headline)
    
    # 5. Source credibility
    source_cred = SourceEvaluator.evaluate_url_or_domain(request.source_url or "")
    
    # 6. ML Model prediction
    ml_result = predictor.predict(cleaned_text, cleaned_headline)
    
    # 7. Key topics/keywords
    keywords = TextCleaner.extract_keywords(f"{cleaned_headline} {cleaned_text}")

    # Combine suspicious indicators
    indicators = list(linguistic.get("indicators", []))
    if clickbait.get("is_clickbait"):
        indicators.extend(clickbait.get("reasons", []))
    if source_cred.get("credibility_score", 0.5) < 0.4:
        indicators.append(f"Domain '{source_cred.get('domain')}' has a low historical credibility rating.")

    return {
        "success": True,
        "input_summary": {
            "headline": cleaned_headline,
            "word_count": len(cleaned_text.split()),
            "keywords": keywords
        },
        "claims": claims,
        "linguistic_analysis": linguistic,
        "sentiment_analysis": sentiment,
        "clickbait_analysis": clickbait,
        "source_credibility": source_cred,
        "ml_prediction": ml_result,
        "suspicious_indicators": indicators
    }

@app.post("/analyze/claims")
def analyze_claims_only(request: ClaimAnalysisRequest):
    cleaned = TextCleaner.clean(request.text)
    claims = ClaimExtractor.extract_claims(cleaned)
    return {"claims": claims}

@app.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...), headline: Optional[str] = Form("")):
    contents = await file.read()
    ocr_result = OCREngine.extract_text_from_image(contents)
    
    if not ocr_result.get("success") or not ocr_result.get("text"):
        raise HTTPException(status_code=400, detail="Could not extract readable text from the provided image.")
        
    extracted_text = ocr_result["text"]
    analysis = analyze_text(TextAnalysisRequest(headline=headline or "", text=extracted_text, source_url=""))
    analysis["ocr_details"] = ocr_result
    return analysis

@app.post("/analyze/pdf")
async def analyze_pdf(file: UploadFile = File(...), headline: Optional[str] = Form("")):
    contents = await file.read()
    pdf_result = OCREngine.extract_text_from_pdf(contents)
    
    if not pdf_result.get("success") or not pdf_result.get("text"):
        raise HTTPException(status_code=400, detail="Could not extract readable text from PDF document.")
        
    extracted_text = pdf_result["text"]
    analysis = analyze_text(TextAnalysisRequest(headline=headline or "", text=extracted_text, source_url=""))
    analysis["pdf_details"] = pdf_result
    return analysis

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
