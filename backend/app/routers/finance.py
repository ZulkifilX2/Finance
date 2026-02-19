from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.parser import DataParser
from app.services.analytics import AnalyticsEngine
from app.models import DashboardResponse, TransactionList
import pandas as pd

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()

        # Parse
        transactions = DataParser.parse_csv(content)

        # Analyze
        analysis = AnalyticsEngine.process_transactions(transactions)

        # Add transactions to response
        analysis['transactions'] = transactions

        return analysis

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/forecast")
async def update_forecast(data: TransactionList):
    try:
        # Convert Pydantic models to dicts
        # Use .dict() method on the model instance (Pydantic v1) or .model_dump() (Pydantic v2)
        # Assuming v1 for broad compatibility or v2 with v1 shim
        transactions = [t.dict() for t in data.transactions]

        # Analyze
        analysis = AnalyticsEngine.process_transactions(transactions)

        # Add transactions back
        analysis['transactions'] = transactions

        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
