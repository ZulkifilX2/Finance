import pandas as pd
from io import BytesIO
from datetime import datetime

class DataParser:
    @staticmethod
    def normalize_columns(df):
        # Map for common headers
        column_map = {
            'Amount': 'amount',
            'Cost': 'amount',
            'Value': 'amount',
            'Transaction Amount': 'amount',
            'Debit': 'amount',
            'Date': 'date',
            'Transaction Date': 'date',
            'Description': 'description',
            'Memo': 'description',
            'Name': 'description'
        }

        df = df.rename(columns=lambda x: column_map.get(x, x))

        # Ensure we have required columns
        required = ['date', 'amount']
        missing = [col for col in required if col not in df.columns]
        if missing:
            raise ValueError(f"Missing required columns: {missing}")

        return df

    @staticmethod
    def clean_data(df):
        # Clean Date
        try:
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
        except Exception:
            pass # Try best effort

        df = df.dropna(subset=['date']) # Drop rows with invalid dates

        # Clean Amount
        # Remove '$', ',', etc if present
        if df['amount'].dtype == 'object':
            df['amount'] = df['amount'].replace(r'[\$,]', '', regex=True)

        df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
        df = df.dropna(subset=['amount'])

        # Sort by date
        df = df.sort_values('date')

        # Add ID for frontend key
        df['id'] = df.index.astype(str)

        # Ensure description exists
        if 'description' not in df.columns:
            df['description'] = 'No Description'

        df['description'] = df['description'].fillna('No Description')

        return df

    @classmethod
    def parse_csv(cls, file_content: bytes):
        try:
            df = pd.read_csv(BytesIO(file_content))
            df = cls.normalize_columns(df)
            df = cls.clean_data(df)

            # Convert to list of dicts for Pydantic
            # Convert date to string for JSON serialization
            df['date'] = df['date'].dt.strftime('%Y-%m-%d')

            return df.to_dict(orient='records')
        except Exception as e:
            raise ValueError(f"Error processing CSV: {str(e)}")
