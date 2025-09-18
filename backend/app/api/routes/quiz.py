from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from sqlalchemy import text
from app.core.database import engine


router = APIRouter()


@router.get("/records", response_model=List[Dict[str, Any]])
def get_quiz_records() -> List[Dict[str, Any]]:
    try:
        with engine.connect() as conn:
            # Alias columns to API-friendly keys
            query = text(
                """
                SELECT
                  id AS id,
                  `Species Name` AS speciesName,
                  `Nature` AS nature,
                  `Wrong Explain` AS wrongExplain,
                  `Correct Explain` AS correctExplain,
                  `Brief Explanation` AS briefExplanation,
                  `Reference` AS reference,
                  created_at AS createdAt
                FROM quiz_records
                ORDER BY id ASC
                """
            )
            result = conn.execute(query)
            rows = result.mappings().all()
            return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch quiz records: {str(e)}")


