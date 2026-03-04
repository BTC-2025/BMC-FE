from fastapi.responses import JSONResponse

def error_response(code: int, message: str):
    return JSONResponse(
        status_code=code,
        content={
            "error": {
                "code": code,
                "message": message
            }
        }
    )
